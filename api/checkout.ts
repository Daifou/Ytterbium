import { Polar } from "@polar-sh/sdk";

// CTO PRINCIPLE: Use Edge Runtime for maximum performance and lower cold starts.
export const config = {
    runtime: "edge",
};

export default async function handler(req: Request) {
    // CTO PRINCIPLE: Resilience & Logging.
    console.log("[POLAR] Initiating checkout process...");

    const accessToken = process.env.POLAR_ACCESS_TOKEN;
    const successUrl = process.env.POLAR_SUCCESS_URL;

    if (!accessToken || !successUrl) {
        console.error("[POLAR] Error: Missing environment variables (POLAR_ACCESS_TOKEN or POLAR_SUCCESS_URL)");
        return new Response(
            JSON.stringify({
                error: "Server Configuration Error",
                message: "Check Vercel Environment Variables."
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("user_id");

        if (!userId) {
            console.warn("[POLAR] Checkout attempted without user_id.");
            return new Response(
                JSON.stringify({ error: "Unauthorized", message: "User identity required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const polar = new Polar({ accessToken });

        // CTO PRINCIPLE: No Placeholders. 
        // We fetch products to find the one the user wants, or use a specific ID if known.
        // Pragmatic Path: Since we don't have the ID, we'll list products and pick the first active one,
        // OR you should set POLAR_PRODUCT_ID in your env.

        let productId = process.env.POLAR_PRODUCT_ID;

        if (!productId) {
            const products = await polar.products.list({
                organizationId: "FIXME_OR_SET_ENV" // You can find this in your Polar dashboard
            });

            if (products.result.items.length > 0) {
                productId = products.result.items[0].id;
            }
        }

        if (!productId) {
            throw new Error("No active product found in Polar account.");
        }

        const checkout = await polar.checkouts.create({
            productId: productId,
            successUrl: successUrl,
            customerMetadata: {
                supabase_user_id: userId,
            },
        });

        console.log(`[POLAR] Checkout created successfully for user ${userId}: ${checkout.url}`);

        return Response.redirect(checkout.url, 303);
    } catch (error: any) {
        console.error("[POLAR] Runtime Exception:", error);
        return new Response(
            JSON.stringify({
                error: "Internal Server Error",
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
