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
        const plan = url.searchParams.get("plan");

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

        // CTO PRINCIPLE: Dynamic Plan Routing.
        // We prioritize specific env vars for each plan type.
        let productId: string | undefined;

        if (plan === "annual") {
            productId = process.env.POLAR_ANNUAL_PRODUCT_ID;
            console.log("[POLAR] Annual plan requested.");
        } else if (plan === "monthly") {
            productId = process.env.POLAR_MONTHLY_PRODUCT_ID;
            console.log("[POLAR] Monthly plan requested.");
        }

        // Fallback to generic product ID if specific one is missing or no plan specified
        if (!productId) {
            productId = process.env.POLAR_PRODUCT_ID;
        }

        if (!productId) {
            console.log("[POLAR] No explicit product ID found, attempting auto-discovery via organization...");
            const organizationId = process.env.POLAR_ORGANIZATION_ID;

            if (!organizationId) {
                return new Response(
                    JSON.stringify({
                        error: "Configuration Missing",
                        message: "Plan not set and no discovery ID provided. Please set POLAR_ANNUAL_PRODUCT_ID or POLAR_MONTHLY_PRODUCT_ID."
                    }),
                    { status: 500, headers: { "Content-Type": "application/json" } }
                );
            }

            const products = await polar.products.list({
                organizationId: organizationId
            });

            // If we have an organization but no specific product, we'll pick based on price if possible,
            // or just the first one if we can't distinguish.
            if (products.result.items.length > 0) {
                // CTO Tip: Search for the product name that matches the plan
                const found = products.result.items.find(p =>
                    p.name.toLowerCase().includes(plan || '') ||
                    p.name.toLowerCase().includes(plan === 'annual' ? 'year' : 'month')
                );
                productId = found ? found.id : products.result.items[0].id;
                console.log(`[POLAR] Found product via discovery: ${productId}`);
            }
        }

        if (!productId) {
            return new Response(
                JSON.stringify({
                    error: "Product Not Found",
                    message: `Could not determine Polar product for plan: ${plan}. Please check your environment variables.`
                }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }


        const checkout = await polar.checkouts.create({
            products: [productId],
            successUrl: successUrl,
            customerMetadata: {
                supabase_user_id: userId,
                plan_type: plan || "unknown"
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
