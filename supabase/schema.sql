-- Supabase Database Schema for HouseAI (Intelligent House Price Prediction Agent)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PREDICTIONS TABLE
CREATE TABLE IF NOT EXISTS public.predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    city TEXT NOT NULL,
    locality TEXT NOT NULL,
    pincode TEXT,
    property_type TEXT NOT NULL,
    area NUMERIC NOT NULL,
    carpet_area NUMERIC,
    bhk INTEGER NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    balconies INTEGER DEFAULT 0,
    floor INTEGER DEFAULT 0,
    total_floors INTEGER DEFAULT 1,
    property_age INTEGER DEFAULT 0,
    parking INTEGER DEFAULT 0,
    furnished TEXT DEFAULT 'Unfurnished',
    property_condition TEXT DEFAULT 'Good',
    amenities JSONB DEFAULT '[]'::jsonb,
    latitude NUMERIC,
    longitude NUMERIC,
    predicted_price NUMERIC NOT NULL,
    price_per_sqft NUMERIC NOT NULL,
    lower_range NUMERIC NOT NULL,
    upper_range NUMERIC NOT NULL,
    model_r2 NUMERIC,
    model_name TEXT DEFAULT 'XGBoost Regressor',
    explanation TEXT,
    feature_contributions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prediction_id UUID REFERENCES public.predictions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, prediction_id)
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Predictions: users can manage their own predictions
CREATE POLICY "Users can view own predictions" ON public.predictions
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert predictions" ON public.predictions
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own predictions" ON public.predictions
    FOR DELETE USING (auth.uid() = user_id);

-- Favorites: users can manage their own favorites
CREATE POLICY "Users can view own favorites" ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert favorites" ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Profile auto-creation trigger on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
