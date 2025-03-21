-- Create tables for Spark Fitness app

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends the auth.users table)
DROP TABLE IF EXISTS profiles;
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  age INTEGER,
  height TEXT,
  weight NUMERIC,
  target_weight NUMERIC,
  primary_goal TEXT,
  weekly_workouts INTEGER,
  coach TEXT,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a trigger to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    'member'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  duration INTEGER,
  coach TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  image_urls TEXT[],
  steps TEXT[],
  tips TEXT[],
  muscles TEXT[],
  equipment TEXT[]
);

-- Workout_exercises table (junction table)
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  sets INTEGER NOT NULL,
  reps TEXT NOT NULL,
  weight TEXT,
  order_num INTEGER NOT NULL,
  UNIQUE(workout_id, exercise_id)
);

-- Workout_logs table
CREATE TABLE IF NOT EXISTS workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  duration INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise_logs table
CREATE TABLE IF NOT EXISTS exercise_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_log_id UUID REFERENCES workout_logs(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
  sets JSONB NOT NULL, -- Array of objects with weight and reps
  notes TEXT
);

-- Progress_photos table
CREATE TABLE IF NOT EXISTS progress_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  weight NUMERIC,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
-- Profiles: Users can only read/update their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own profile
CREATE POLICY "Users can create their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow the trigger function to create profiles
CREATE POLICY "Allow trigger to create profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Workout_logs: Users can only CRUD their own workout logs
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workout logs" 
  ON workout_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout logs" 
  ON workout_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout logs" 
  ON workout_logs FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout logs" 
  ON workout_logs FOR DELETE 
  USING (auth.uid() = user_id);

-- Exercise_logs: Users can only CRUD their own exercise logs (via workout_logs)
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own exercise logs" 
  ON exercise_logs FOR SELECT 
  USING (
    workout_log_id IN (
      SELECT id FROM workout_logs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own exercise logs" 
  ON exercise_logs FOR INSERT 
  WITH CHECK (
    workout_log_id IN (
      SELECT id FROM workout_logs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own exercise logs" 
  ON exercise_logs FOR UPDATE 
  USING (
    workout_log_id IN (
      SELECT id FROM workout_logs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own exercise logs" 
  ON exercise_logs FOR DELETE 
  USING (
    workout_log_id IN (
      SELECT id FROM workout_logs WHERE user_id = auth.uid()
    )
  );

-- Progress_photos: Users can only CRUD their own progress photos
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress photos" 
  ON progress_photos FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress photos" 
  ON progress_photos FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress photos" 
  ON progress_photos FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress photos" 
  ON progress_photos FOR DELETE 
  USING (auth.uid() = user_id);

-- Workouts and Exercises are public read-only
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workouts are viewable by all users" 
  ON workouts FOR SELECT 
  USING (true);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Exercises are viewable by all users" 
  ON exercises FOR SELECT 
  USING (true);

ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workout exercises are viewable by all users" 
  ON workout_exercises FOR SELECT 
  USING (true);

