-- 1. Create Tables for Polar Sync Data
-- These will be populated by the Polar Supabase Adapter

CREATE TABLE IF NOT EXISTS public.polar_products (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    price_amount INTEGER,
    price_currency TEXT,
    organization_id UUID NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.polar_subscriptions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.polar_products(id),
    status TEXT NOT NULL, -- 'active', 'canceled', 'incomplete', etc.
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS on all tables
ALTER TABLE public.polar_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polar_subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies: Security First Principle
-- Products are public (so users can see what they are buying)
CREATE POLICY "Products are viewable by everyone" 
ON public.polar_products FOR SELECT 
USING (true);

-- Subscriptions are strictly private
CREATE POLICY "Users can only view their own subscriptions" 
ON public.polar_subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Update Trigger for Timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_polar_products
    BEFORE UPDATE ON public.polar_products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_polar_subscriptions
    BEFORE UPDATE ON public.polar_subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. Helper View for Active Subscriptions
CREATE OR REPLACE VIEW public.user_subscriptions AS
SELECT 
    s.*,
    p.name as product_name,
    p.is_recurring
FROM public.polar_subscriptions s
JOIN public.polar_products p ON s.product_id = p.id
WHERE s.status = 'active';

COMMENT ON TABLE public.polar_subscriptions IS 'Synced subscriptions from Polar.sh';
