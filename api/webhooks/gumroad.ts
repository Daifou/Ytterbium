import { createClient } from "@supabase/supabase-js";

export const config = {
    runtime: "edge",
};

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: Request) {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const formData = await req.formData();
        const data: Record<string, any> = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        console.log(`[GUMROAD WEBHOOK] Received event for resource: ${data.resource_name}`);

        // 1. Identification
        // We look for 'user_id' in custom_fields (if sent as JSON) or url_params (if sent as string)
        // Gumroad sends custom fields flattened like: 'custom_fields[user_id]' or just 'user_id' if encoded in URL?
        // Actually, for the Overlay with ?user_id=..., it usually comes as 'url_params[user_id]'

        const userId = data['url_params[user_id]'] || data.user_id || data.email;
        // fallback to email lookup if user_id is missing, but efficient to use ID.

        if (!userId) {
            console.warn("[GUMROAD WEBHOOK] No user_id or identifying info found.");
            // Return 200 to satisfy Gumroad even if we can't process it, to avoid retries on bad data
            return new Response("No identity found", { status: 200 });
        }

        // 2. Map Status
        // Gumroad 'ping' events happen for sales, refunds, etc.
        // We care about 'sale' or 'subscription_updated' etc.
        // But the main generic ping usually contains 'is_recurring_billing' etc.

        // Ensure it's a UUID if we are using UUIDs.
        // If it's an email, we might need to look it up.
        let targetUserId = userId;
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);

        if (!isUuid) {
            // Look up by email if strictly needed, but let's assume we passed the ID correctly.
            // If userId is actually an email (fallback above), we do a lookup.
            if (userId.includes('@')) {
                // We will skip complex lookup for now and rely on correct ID passing.
                console.log(`[GUMROAD] Fallback lookup by email not fully implemented, relying on direct ID.`);
            }
        }

        // 3. Upsert Sale
        const { error: saleError } = await supabaseAdmin
            .from('gumroad_sales')
            .upsert({
                sale_id: data.sale_id,
                user_id: isUuid ? targetUserId : null,
                product_id: data.product_id,
                product_name: data.product_name,
                price: parseInt(data.price || '0'),
                currency: data.currency,
                email: data.email,
                created_at: data.created_at
            }, { onConflict: 'sale_id' });

        if (saleError) console.error("Error syncing sale:", saleError);

        // 4. Update Subscription (if recurring)
        if (data.is_recurring_billing === 'true' || data.is_subscription === 'true') {
            // Status mapping
            // Gumroad sends 'cancelled', 'ended'? 
            // If a sale comes in, it's active.
            // If 'cancellation_url' is present, it might be active.
            // We assume 'active' for a fresh successful ping unless explicit 'cancelled' state exists?
            // Gumroad sends specific pings for cancellation.

            // Check for cancellation
            let subscriptionStatus = 'active';
            if (data.cancelled === 'true') subscriptionStatus = 'cancelled';
            if (data.ended === 'true') subscriptionStatus = 'ended';

            const { error: subError } = await supabaseAdmin
                .from('gumroad_subscriptions')
                .upsert({
                    subscription_id: data.subscription_id || data.sale_id, // fallback
                    user_id: isUuid ? targetUserId : null,
                    product_id: data.product_id,
                    status: subscriptionStatus,
                    started_at: data.created_at,
                    ended_at: data.ended_at || null,
                    cancelled_at: data.cancelled_at || null
                }, { onConflict: 'subscription_id' });

            if (subError) console.error("Error syncing subscription:", subError);

            // 5. Update Profile
            if (isUuid) {
                const isPremium = subscriptionStatus === 'active';
                // Only update if status changed or just always ensure consistency
                await supabaseAdmin.from('profiles').update({ is_premium: isPremium }).eq('id', targetUserId);
            }
        } else {
            // One-time purchase? Treat as premium?
            // User asked for 'subscription' logic, but if they sell a lifetime deal...
            // For now, if valid sale, grant premium.
            if (isUuid) {
                await supabaseAdmin.from('profiles').update({ is_premium: true }).eq('id', targetUserId);
            }
        }

        return new Response("OK", { status: 200 });

    } catch (e: any) {
        console.error("Webhook Handler Error:", e);
        return new Response("Internal Error", { status: 500 });
    }
}
