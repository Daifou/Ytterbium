import { Webhooks } from "@polar-sh/nextjs";
import { createClient } from "@supabase/supabase-js";

// CTO Note: Standardized handler using the Polar SDK built-in router.
// This is much more resilient and handles signature verification automatically.
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const POST = Webhooks({
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
    onPayload: async (payload) => {
        // Custom logic for critical events
        // Pragmatic CTO: Let the Polar Adapter handle the heavy lifting of syncing
        // subscriptions tables, while we handle app-specific state here.
        switch (payload.type) {
            case "checkout.created":
                console.log(`[POLAR] Checkout created: ${payload.data.id}`);
                break;

            case "subscription.active":
            case "subscription.updated":
            case "subscription.revoked":
                const subscription = payload.data;
                // Sync to custom profile flags
                const { error } = await supabaseAdmin
                    .from("profiles")
                    .update({
                        is_premium: subscription.status === 'active',
                        subscription_id: subscription.id
                    })
                    .eq("id", subscription.user_id);

                if (error) {
                    console.error(`[POLAR] Profile sync error: ${error.message}`);
                    throw error; // Polar will retry on non-200 responses
                }
                break;
        }
    }
});
