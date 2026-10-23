-- Minimal public catalog schema for Distribuidora SAMA.

-- 1) Tables
CREATE TABLE public.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.brands (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    logo_url text,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sku text NOT NULL UNIQUE,
    name text NOT NULL,
    category_id uuid REFERENCES public.categories(id),
    brand_id uuid REFERENCES public.brands(id),
    subcategory text,
    description text,
    image_url text,
    stock integer CHECK (stock IS NULL OR stock >= 0),
    is_featured boolean NOT NULL DEFAULT false,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Indexes
CREATE INDEX products_category_id_idx
    ON public.products (category_id);

-- 3) Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4) Permissions
GRANT SELECT
    ON public.categories, public.brands, public.products
    TO anon, authenticated;

-- 5) Policies
CREATE POLICY "Public can read active categories"
    ON public.categories
    FOR SELECT
    TO anon, authenticated
    USING (is_active);

CREATE POLICY "Public can read active brands"
    ON public.brands
    FOR SELECT
    TO anon, authenticated
    USING (is_active);

CREATE POLICY "Public can read active products"
    ON public.products
    FOR SELECT
    TO anon, authenticated
    USING (is_active);

NOTIFY pgrst, 'reload schema';