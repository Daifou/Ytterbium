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
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const body = await req.json();
        const { type, data } = body;

        console.log(`[POLAR WEBHOOK] Received event: ${type}`);

        switch (type) {
            case "checkout.created":
                console.log(`[POLAR WEBHOOK] Checkout created: ${data.id}`);
                break;

            case "subscription.active":
            case "subscription.updated":
            case "subscription.revoked":
                const subscription = data;
                const userId = subscription.customer_metadata?.supabase_user_id || subscription.user_id;

                console.log(`[POLAR WEBHOOK] Syncing subscription ${subscription.id} for user ${userId}`);

                const { error } = await supabaseAdmin
                    .from("profiles")
                    .update({
                        is_premium: subscription.status === 'active',
                        subscription_id: subscription.id
                    })
                    .eq("id", userId);

                if (error) {
                    console.error(`[POLAR WEBHOOK] Sync error: ${error.message}`);
                    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
                }
                break;

            default:
                console.log(`[POLAR WEBHOOK] Unhandled event type: ${type}`);
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("[POLAR WEBHOOK] Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
}
