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

    // Get OpenAI API key (optional now)
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    let aiAnalysis;
    
    if (openAIApiKey) {
      // Try OpenAI first if API key is available
      try {
        console.log('Attempting OpenAI API call...');
        
        const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
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
            max_tokens: 1500,
            temperature: 0.7,
          }),
        });

        if (openAIResponse.ok) {
          const openAIData = await openAIResponse.json();
          const aiContent = openAIData.choices[0].message.content;
          console.log('OpenAI response received:', aiContent);
          aiAnalysis = JSON.parse(aiContent);
        } else {
          console.log('OpenAI API failed, using fallback');
          throw new Error('OpenAI API failed');
        }
      } catch (error) {
        console.log('OpenAI error, using intelligent fallback:', error.message);
        aiAnalysis = generateIntelligentRecommendations(answers);
      }
    } else {
      console.log('No OpenAI key, using intelligent fallback');
      aiAnalysis = generateIntelligentRecommendations(answers);
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

// Intelligent fallback recommendation system
function generateIntelligentRecommendations(answers: QuizAnswers) {
  console.log('Generating intelligent recommendations based on answers:', answers);
  
  // Analyze answers to determine patterns
  const answerValues = Object.values(answers);
  const analysisScores = {
    technical: 0,
    business: 0,
    creative: 0,
    social: 0,
    scientific: 0
  };

  // Score each category based on answer patterns
  answerValues.forEach(answer => {
    const lowerAnswer = answer.toLowerCase();
    
    // Technical/STEM indicators
    if (lowerAnswer.includes('mathematical') || lowerAnswer.includes('technical') || 
        lowerAnswer.includes('software') || lowerAnswer.includes('physics') ||
        lowerAnswer.includes('systematically') || lowerAnswer.includes('analyze')) {
      analysisScores.technical += 2;
    }
    
    // Business indicators
    if (lowerAnswer.includes('business') || lowerAnswer.includes('manage') ||
        lowerAnswer.includes('organize') || lowerAnswer.includes('economics') ||
        lowerAnswer.includes('office') || lowerAnswer.includes('lead')) {
      analysisScores.business += 2;
    }
    
    // Creative indicators
    if (lowerAnswer.includes('creative') || lowerAnswer.includes('writing') ||
        lowerAnswer.includes('studio') || lowerAnswer.includes('brainstorm') ||
        lowerAnswer.includes('ideas') || lowerAnswer.includes('innovative')) {
      analysisScores.creative += 2;
    }
    
    // Social/helping indicators
    if (lowerAnswer.includes('people') || lowerAnswer.includes('society') ||
        lowerAnswer.includes('helping') || lowerAnswer.includes('social') ||
        lowerAnswer.includes('healthcare') || lowerAnswer.includes('difference')) {
      analysisScores.social += 2;
    }
    
    // Scientific indicators
    if (lowerAnswer.includes('experiment') || lowerAnswer.includes('research') ||
        lowerAnswer.includes('biology') || lowerAnswer.includes('chemistry') ||
        lowerAnswer.includes('discoveries') || lowerAnswer.includes('laboratory')) {
      analysisScores.scientific += 2;
    }
  });

  console.log('Analysis scores:', analysisScores);

  // Sort categories by score
  const sortedCategories = Object.entries(analysisScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const recommendations = [];
  let analysis = "Based on your responses, ";

  // Generate recommendations based on top categories
  for (let i = 0; i < 3; i++) {
    const [category, score] = sortedCategories[i] || ['technical', 1];
    const confidence = Math.max(65, Math.min(95, 65 + (score * 5)));

    switch (category) {
      case 'technical':
        recommendations.push({
          course: "Bachelor of Computer Science",
          confidence,
          reasoning: "Your analytical thinking and technical problem-solving approach make computer science an excellent fit. You show strong logical reasoning skills.",
          careerPaths: ["Software Developer", "Data Scientist", "Systems Analyst", "AI Engineer"],
          prerequisites: ["Mathematics", "Physics", "Computer Science Basics"],
          duration: "3-4 years"
        });
        if (i === 0) analysis += "you demonstrate strong analytical and technical aptitude";
        break;

      case 'business':
        recommendations.push({
          course: "Bachelor of Business Administration",
          confidence,
          reasoning: "Your leadership qualities and interest in organizational dynamics indicate strong business acumen and management potential.",
          careerPaths: ["Business Manager", "Entrepreneur", "Marketing Director", "Project Manager"],
          prerequisites: ["Economics", "Mathematics", "Business Studies"],
          duration: "3-4 years"
        });
        if (i === 0) analysis += "you show natural leadership and business orientation";
        break;

      case 'creative':
        recommendations.push({
          course: "Bachelor of Design & Creative Arts",
          confidence,
          reasoning: "Your creative problem-solving approach and innovative thinking make you well-suited for creative fields that blend art with practical application.",
          careerPaths: ["Graphic Designer", "Creative Director", "UX/UI Designer", "Art Director"],
          prerequisites: ["Art", "Design Fundamentals", "Digital Media"],
          duration: "3-4 years"
        });
        if (i === 0) analysis += "you exhibit strong creative and innovative thinking";
        break;

      case 'social':
        recommendations.push({
          course: "Bachelor of Psychology",
          confidence,
          reasoning: "Your empathy and desire to make a positive impact on society, combined with your people-focused approach, align perfectly with psychology.",
          careerPaths: ["Clinical Psychologist", "Counselor", "HR Specialist", "Social Worker"],
          prerequisites: ["Psychology", "Sociology", "Biology"],
          duration: "3-4 years"
        });
        if (i === 0) analysis += "you have a strong desire to help others and understand human behavior";
        break;

      case 'scientific':
        recommendations.push({
          course: "Bachelor of Biotechnology",
          confidence,
          reasoning: "Your scientific curiosity and research-oriented mindset make you ideal for biotechnology, combining biology with practical applications.",
          careerPaths: ["Research Scientist", "Biotech Engineer", "Laboratory Manager", "Medical Researcher"],
          prerequisites: ["Biology", "Chemistry", "Mathematics"],
          duration: "3-4 years"
        });
        if (i === 0) analysis += "you show strong scientific curiosity and research aptitude";
        break;
    }
  }

  analysis += ". Your responses indicate a well-rounded personality with clear strengths that align with multiple career paths.";

  return {
    recommendations,
    analysis
  };
}

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