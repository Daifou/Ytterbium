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
            console.warn("[POLAR] Checkout attempted without user_id. Params:", url.search);
            return new Response(
                JSON.stringify({
                    error: "Unauthorized",
                    message: "User identity required.",
                    diagnostics: {
                        url: req.url,
                        params: Array.from(url.searchParams.entries())
                    }
                }),
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
            console.log("[POLAR] POLAR_PRODUCT_ID not set, attempting to list products...");
            const organizationId = process.env.POLAR_ORGANIZATION_ID;

            if (!organizationId) {
                return new Response(
                    JSON.stringify({
                        error: "Configuration Missing",
                        message: "Neither POLAR_PRODUCT_ID nor POLAR_ORGANIZATION_ID is set in environment variables."
                    }),
                    { status: 500, headers: { "Content-Type": "application/json" } }
                );
            }

            const products = await polar.products.list({
                organizationId: organizationId
            });

            if (products.result.items.length > 0) {
                productId = products.result.items[0].id;
                console.log(`[POLAR] Found product through organization: ${productId}`);
            }
        }

        if (!productId) {
            return new Response(
                JSON.stringify({
                    error: "Product Not Found",
                    message: "Could not find a valid Polar product ID. Please set POLAR_PRODUCT_ID."
                }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }


        const checkout = await polar.checkouts.create({
            products: [productId],
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
