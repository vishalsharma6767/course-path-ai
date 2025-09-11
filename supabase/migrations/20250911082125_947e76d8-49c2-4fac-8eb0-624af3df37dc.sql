-- Fix function security by setting search_path
CREATE OR REPLACE FUNCTION public.create_ai_chat_response(
  user_message TEXT,
  user_context JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE(response TEXT, success BOOLEAN, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function will be enhanced with OpenAI integration via edge function
  RETURN QUERY SELECT 
    'I understand you need guidance with your career planning. As your AI mentor, I can help with course selection, exam preparation, college choices, and career planning. What specific area would you like to discuss?' as response,
    true as success,
    null::text as error_message;
END;
$$;