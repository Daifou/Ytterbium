import { createClient } from "@supabase/supabase-js";
import { logger } from "../../lib/logger";

export const config = {
    runtime: "edge",
};

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const WHOP_WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET!;

async function verifyWhopSignature(payload: string, signature: string) {
    if (!WHOP_WEBHOOK_SECRET) return true;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(WHOP_WEBHOOK_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signedBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const signedArray = Array.from(new Uint8Array(signedBuffer));
    const hmacHex = signedArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hmacHex === signature;
}

export default async function handler(req: Request) {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const body = await req.text();
        const signature = req.headers.get("x-whop-signature");

        if (signature && !(await verifyWhopSignature(body, signature))) {
            return new Response(JSON.stringify({ error: "Invalid signature" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        const event = JSON.parse(body);
        const { action, data } = event;

        logger.info(`Whop webhook received`, { action });

        const email = data.user?.email || data.email;
        let profileId = null;

        if (email) {
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('email', email)
                .single();
            if (profile) profileId = profile.id;
        }

        if (!profileId) {
            logger.warn(`User not found for Whop webhook`, { email });
            return new Response("User not found", { status: 200 });
        }

        switch (action) {
            case "membership_activated":
            case "membership_renewed":
                await supabaseAdmin.from('profiles').update({
                    subscription_status: 'active',
                    plan_type: data.plan?.name || 'premium',
                    current_period_end: data.next_payment_at || data.expires_at,
                    is_premium: true
                }).eq('id', profileId);
                logger.info(`Subscription activated/renewed for user`, { profileId, email });
                break;

            case "membership_deactivated":
            case "membership_expired":
                await supabaseAdmin.from('profiles').update({
                    subscription_status: 'expired',
                    is_premium: false
                }).eq('id', profileId);
                logger.info(`Subscription deactivated for user`, { profileId, email });
                break;

            case "invoice_paid":
            case "payment_succeeded":
                await supabaseAdmin.from('profiles').update({ is_premium: true }).eq('id', profileId);
                logger.info(`Payment succeeded for user`, { profileId, email });
                break;

            case "refund_created":
                await supabaseAdmin.from('profiles').update({
                    subscription_status: 'refunded',
                    is_premium: false
                }).eq('id', profileId);
                logger.info(`Refund processed for user`, { profileId, email });
                break;

            default:
                logger.info(`Unhandled Whop action`, { action });
        }

        return new Response("OK", { status: 200 });

    } catch (e: any) {
        logger.error("Whop Webhook Error", e);
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
