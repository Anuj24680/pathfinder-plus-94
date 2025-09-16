-- Create user profiles table with different roles
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'parent', 'mentor')),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student-specific data table
CREATE TABLE public.student_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  grade TEXT,
  stream TEXT,
  academic_scores JSONB,
  skills JSONB,
  interests JSONB,
  career_goals TEXT,
  entrance_exams JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create parent profiles table
CREATE TABLE public.parent_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES auth.users(id),
  occupation TEXT,
  education TEXT,
  annual_income NUMERIC,
  savings_amount NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mentor profiles table
CREATE TABLE public.mentor_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  expertise_areas JSONB,
  experience_years INTEGER,
  qualification TEXT,
  bio TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create roadmaps table
CREATE TABLE public.roadmaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  milestones JSONB,
  deadlines JSONB,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recommendations table
CREATE TABLE public.recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('career', 'college', 'course', 'scholarship')),
  title TEXT NOT NULL,
  description TEXT,
  criteria_match JSONB,
  relevance_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for student profiles
CREATE POLICY "Students can manage their own profile" ON public.student_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Parents can view their child's profile" ON public.student_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parent_profiles 
      WHERE parent_profiles.user_id = auth.uid() 
      AND parent_profiles.child_id = student_profiles.user_id
    )
  );

CREATE POLICY "Mentors can view student profiles" ON public.student_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'mentor'
    )
  );

-- Create RLS policies for parent profiles
CREATE POLICY "Parents can manage their own profile" ON public.parent_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for mentor profiles
CREATE POLICY "Mentors can manage their own profile" ON public.mentor_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view mentor profiles" ON public.mentor_profiles
  FOR SELECT USING (true);

-- Create RLS policies for roadmaps
CREATE POLICY "Students can manage their own roadmaps" ON public.roadmaps
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Parents can view their child's roadmaps" ON public.roadmaps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parent_profiles 
      WHERE parent_profiles.user_id = auth.uid() 
      AND parent_profiles.child_id = roadmaps.student_id
    )
  );

CREATE POLICY "Mentors can view and update roadmaps" ON public.roadmaps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'mentor'
    )
  );

-- Create RLS policies for recommendations
CREATE POLICY "Students can view their own recommendations" ON public.recommendations
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "System can insert recommendations" ON public.recommendations
  FOR INSERT WITH CHECK (true);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student'),
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parent_profiles_updated_at
  BEFORE UPDATE ON public.parent_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentor_profiles_updated_at
  BEFORE UPDATE ON public.mentor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roadmaps_updated_at
  BEFORE UPDATE ON public.roadmaps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();