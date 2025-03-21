-- Add subscription table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  plan_type TEXT NOT NULL, -- 'monthly', 'quarterly', 'yearly'
  status TEXT NOT NULL, -- 'active', 'expired', 'cancelled'
  amount NUMERIC NOT NULL,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add meal plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add meals table
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  time_of_day TEXT NOT NULL, -- 'breakfast', 'lunch', 'dinner', 'snack'
  calories INTEGER,
  protein NUMERIC,
  carbs NUMERIC,
  fat NUMERIC,
  recipe TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add coach notes table
CREATE TABLE IF NOT EXISTS coach_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  coach_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add user roles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member';

-- Set up Row Level Security (RLS)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_notes ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" 
ON subscriptions FOR SELECT 
USING (auth.uid() = user_id OR EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can insert subscriptions" 
ON subscriptions FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can update subscriptions" 
ON subscriptions FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
));

-- Meal plans policies
CREATE POLICY "Users can view their own meal plans" 
ON meal_plans FOR SELECT 
USING (auth.uid() = user_id OR EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can insert meal plans" 
ON meal_plans FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can update meal plans" 
ON meal_plans FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
));

-- Meals policies
CREATE POLICY "Users can view meals in their meal plans" 
ON meals FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM meal_plans 
  WHERE meal_plans.id = meal_plan_id 
  AND (meal_plans.user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
  ))
));

CREATE POLICY "Admins can insert meals" 
ON meals FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can update meals" 
ON meals FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
));

-- Coach notes policies
CREATE POLICY "Users can view their own coach notes" 
ON coach_notes FOR SELECT 
USING (auth.uid() = user_id OR EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can insert coach notes" 
ON coach_notes FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can update coach notes" 
ON coach_notes FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
));

