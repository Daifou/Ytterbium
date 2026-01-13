import { createClient } from "@supabase/supabase-js";
import { logger } from "../../lib/logger";
import { handleError, AppError } from "../../lib/errorHandler";

export const config = {
    runtime: "edge",
};

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: Request) {
    if (req.method !== "GET") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            throw new AppError("Unauthorized", 401);
        }

        const token = authHeader.replace("Bearer ", "");
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            throw new AppError("Unauthorized", 401);
        }

        const { data: profile, error: dbError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (dbError) {
            logger.error("Error fetching profile", { dbError, userId: user.id });
            throw new AppError("Database Error", 500);
        }

        logger.info(`User profile fetched for rehydration`, { userId: user.id });

        return new Response(JSON.stringify({ user, profile }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (e: any) {
        return handleError(e);
    }
}
