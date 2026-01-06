-- 1. Gumroad Sales Table
-- Stores raw sales data from Gumroad webhooks
CREATE TABLE IF NOT EXISTS public.gumroad_sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sale_id TEXT UNIQUE NOT NULL, -- 'sale_id' from Gumroad
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Matched via 'user_id' custom field
    product_id TEXT NOT NULL,
    product_name TEXT,
    price INTEGER, -- stored in cents usually, but Gumroad sends formatted. We'll store raw price.
    currency TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE, -- 'created_at' from Gumroad
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Gumroad Subscriptions Table
-- Specifically for tracking active subscriptions
CREATE TABLE IF NOT EXISTS public.gumroad_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscription_id TEXT UNIQUE NOT NULL, -- 'subscription_id' from Gumroad
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    status TEXT NOT NULL, -- 'active', 'cancelled', 'ended'
    started_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    last_payment_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS
ALTER TABLE public.gumroad_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gumroad_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sales" ON public.gumroad_sales
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscriptions" ON public.gumroad_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- 4. View for Unified Subscription Access (Replacing the Polar one)
-- Using a DO block to safely drop if it's a table OR a view
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_subscriptions' AND table_schema = 'public') THEN
        DROP TABLE IF EXISTS public.user_subscriptions CASCADE;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'user_subscriptions' AND table_schema = 'public') THEN
        DROP VIEW IF EXISTS public.user_subscriptions CASCADE;
    END IF;
END $$;

CREATE OR REPLACE VIEW public.user_subscriptions AS
SELECT 
    s.id,
    s.user_id,
    s.status,
    s.product_id as product_name, -- Temporary mapping
    s.ended_at as current_period_end, -- Approximate
    true as is_recurring
FROM public.gumroad_subscriptions s
WHERE s.status = 'active' OR s.status = 'trialing';
