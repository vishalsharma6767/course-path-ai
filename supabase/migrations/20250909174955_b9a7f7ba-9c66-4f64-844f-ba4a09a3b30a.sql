-- Create quiz results table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  recommended_courses TEXT[],
  ai_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course guidance table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.course_guidance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_name TEXT NOT NULL,
  career_options JSONB,
  roadmap JSONB,
  colleges JSONB,
  scholarships JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_guidance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for quiz_results
DROP POLICY IF EXISTS "Users can view their own quiz results" ON public.quiz_results;
CREATE POLICY "Users can view their own quiz results"
ON public.quiz_results
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own quiz results" ON public.quiz_results;
CREATE POLICY "Users can create their own quiz results"
ON public.quiz_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for course_guidance (public read access)
DROP POLICY IF EXISTS "Course guidance is publicly readable" ON public.course_guidance;
CREATE POLICY "Course guidance is publicly readable"
ON public.course_guidance
FOR SELECT
USING (true);