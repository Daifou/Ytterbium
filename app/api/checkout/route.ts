import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    successUrl: process.env.POLAR_SUCCESS_URL!,
    /* 
      CTO Note: We assign the user_id from the query param to the checkout session.
      Polar will then include this in the webhook payload, allowing us to link 
      the purchase to the correct Supabase user.
    */
    onCheckout: async (request, options) => {
        const url = new URL(request.url);
        const userId = url.searchParams.get("user_id");

        if (!userId) {
            return new Response("Missing user_id", { status: 400 });
        }

        return {
            ...options,
            customerMetadata: {
                supabase_user_id: userId
            }
        };
    }
});
