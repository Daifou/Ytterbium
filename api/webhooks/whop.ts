import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { logger } from "../../lib/logger";
import { handleError, AppError } from "../../lib/errorHandler";

export const config = {
    runtime: "edge",
};

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const WHOP_WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET!;

const verifyWhopSignature = (payload: string, signature: string) => {
    if (!WHOP_WEBHOOK_SECRET) return true;
    const hmac = crypto.createHmac("sha256", WHOP_WEBHOOK_SECRET);
    const digest = Buffer.from(hmac.update(payload).digest("hex"), "utf8");
    const sig = Buffer.from(signature, "utf8");
    return sig.length === digest.length && crypto.timingSafeEqual(sig, digest);
};

export default async function handler(req: Request) {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const body = await req.text();
        const signature = req.headers.get("x-whop-signature");

        if (signature && !verifyWhopSignature(body, signature)) {
            throw new AppError("Invalid signature", 401);
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
            case "membership.activated":
            case "membership.renewed":
                await supabaseAdmin.from('profiles').update({
                    subscription_status: 'active',
                    plan_type: data.plan?.name || 'premium',
                    current_period_end: data.next_payment_at || data.expires_at,
                    is_premium: true
                }).eq('id', profileId);
                logger.info(`Subscription activated/renewed for user`, { profileId, email });
                break;

            case "membership.deactivated":
            case "membership.expired":
                await supabaseAdmin.from('profiles').update({
                    subscription_status: 'expired',
                    is_premium: false
                }).eq('id', profileId);
                logger.info(`Subscription deactivated for user`, { profileId, email });
                break;

            default:
                logger.info(`Unhandled Whop action`, { action });
        }

        return new Response("OK", { status: 200 });

    } catch (e: any) {
        return handleError(e);
    }
}
