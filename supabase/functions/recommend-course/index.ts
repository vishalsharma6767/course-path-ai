import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuizAnswers {
  [questionId: string]: string;
}

interface CourseRecommendation {
  course: string;
  confidence: number;
  reasoning: string;
  careerPaths: string[];
  prerequisites: string[];
  duration: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers, userId }: { answers: QuizAnswers; userId: string } = await req.json();
    
    console.log('Processing quiz for user:', userId);
    console.log('Quiz answers received:', answers);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    // Prepare prompt for AI analysis
    const answersText = Object.entries(answers).map(([questionId, answer]) => 
      `Q${questionId}: ${answer}`
    ).join('\n');

    const prompt = `
    You are an expert educational counselor and career advisor. Based on the following quiz responses from a student, recommend the top 3 most suitable undergraduate courses/programs.

    Quiz Responses:
    ${answersText}

    Available Course Categories:
    - Engineering & Technology (Computer Science, Mechanical, Electrical, Civil, etc.)
    - Business & Management (BBA, Economics, Commerce, etc.) 
    - Sciences (Physics, Chemistry, Biology, Mathematics, etc.)
    - Arts & Humanities (Literature, Psychology, Philosophy, etc.)
    - Medical & Health Sciences (MBBS, Nursing, Pharmacy, etc.)
    - Law & Legal Studies
    - Design & Creative Arts
    - Agriculture & Life Sciences
    - Social Sciences (Sociology, Political Science, etc.)

    Please analyze the responses and provide exactly 3 course recommendations in the following JSON format:
    {
      "recommendations": [
        {
          "course": "Full course name (e.g., Bachelor of Computer Science)",
          "confidence": 85,
          "reasoning": "Clear explanation why this course suits the student based on their quiz responses",
          "careerPaths": ["Career option 1", "Career option 2", "Career option 3"],
          "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
          "duration": "3-4 years"
        }
      ],
      "analysis": "Overall analysis of the student's interests, strengths, and personality based on quiz responses"
    }

    Base your recommendations on:
    1. Stated interests and preferred activities
    2. Motivation and goals
    3. Personality traits and working style
    4. Preferred environment and work type
    5. Subject preferences
    6. Problem-solving approach

    Ensure each recommendation is well-reasoned and matches the student's profile.
    `;

    // Call OpenAI API with retry logic
    console.log('Calling OpenAI API...');
    let openAIResponse;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4.1-2025-04-14',
            messages: [
              {
                role: 'system',
                content: 'You are an expert educational counselor. Always respond with valid JSON only.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_completion_tokens: 1500,
            temperature: 0.7,
          }),
        });
        
        if (openAIResponse.ok) {
          break; // Success, exit retry loop
        } else if (openAIResponse.status === 429) {
          // Rate limit, wait and retry
          console.log(`Rate limited, retrying in ${(retryCount + 1) * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
          retryCount++;
        } else {
          // Other error, don't retry
          break;
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        retryCount++;
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    const aiContent = openAIData.choices[0].message.content;
    
    console.log('OpenAI response:', aiContent);

    // Parse the AI response
    let aiAnalysis;
    try {
      aiAnalysis = JSON.parse(aiContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw AI content:', aiContent);
      
      // Fallback recommendations if AI parsing fails
      aiAnalysis = {
        recommendations: [
          {
            course: "Bachelor of Computer Science",
            confidence: 75,
            reasoning: "Based on your quiz responses, you show strong analytical and problem-solving skills suitable for computer science.",
            careerPaths: ["Software Developer", "Data Scientist", "IT Consultant"],
            prerequisites: ["Mathematics", "Physics"],
            duration: "3-4 years"
          },
          {
            course: "Bachelor of Business Administration",
            confidence: 70,
            reasoning: "Your leadership tendencies and interest in working with teams suggest business administration would be suitable.",
            careerPaths: ["Business Manager", "Entrepreneur", "Marketing Manager"],
            prerequisites: ["Economics", "Mathematics"],
            duration: "3-4 years"
          },
          {
            course: "Bachelor of Arts in Psychology",
            confidence: 65,
            reasoning: "Your interest in understanding and helping people indicates psychology as a good fit.",
            careerPaths: ["Psychologist", "Counselor", "HR Specialist"],
            prerequisites: ["Psychology", "Sociology"],
            duration: "3-4 years"
          }
        ],
        analysis: "Based on your responses, you demonstrate strong analytical skills, leadership potential, and interest in helping others."
      };
    }

    const recommendedCourses = aiAnalysis.recommendations.map((rec: any) => rec.course);

    // Save quiz results to database
    const { error: insertError } = await supabase
      .from('quiz_results')
      .insert({
        user_id: userId,
        answers: answers,
        recommended_courses: recommendedCourses,
        ai_analysis: aiAnalysis
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    console.log('Quiz results saved successfully');

    return new Response(
      JSON.stringify({
        success: true,
        recommendations: aiAnalysis.recommendations,
        analysis: aiAnalysis.analysis
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in recommend-course function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});