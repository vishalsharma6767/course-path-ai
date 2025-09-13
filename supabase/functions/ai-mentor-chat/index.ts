import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, context } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    let response: string;

    if (openaiApiKey) {
      // Use OpenAI API for advanced responses
      try {
        const systemPrompt = `You are an AI Career Mentor for Indian students, designed to provide personalized guidance on career planning, course selection, exam preparation, and educational opportunities in India.

Your expertise includes:
- Indian education system (10th, 12th, UG, PG)
- Career guidance and aptitude assessment
- Entrance exams (JEE, NEET, GATE, CAT, UPSC, etc.)
- Course and college recommendations
- Scholarship and financial aid opportunities
- Study abroad guidance
- Skill development and industry trends
- Mental health and stress management for students
- Study techniques and time management
- Smart timetable creation and planning

Guidelines:
- Be encouraging, supportive, and practical
- Provide specific, actionable advice
- Use simple, clear language with emojis for engagement
- Consider Indian context, culture, and opportunities
- Ask follow-up questions to better understand student needs
- Provide realistic timelines and expectations
- Include relevant resources and next steps
- Suggest study techniques like Pomodoro, spaced repetition
- Help with motivation and goal setting
- Offer to create personalized timetables when appropriate

When users ask about timetables or study planning:
- Ask structured questions: subjects, available hours, activities, goals
- Suggest both academic-only and balanced schedule options
- Recommend proven study techniques
- Provide motivational tips for consistency

Student Context: ${context ? JSON.stringify(context) : 'No additional context provided'}`;

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4.1-2025-04-14',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message }
            ],
            max_completion_tokens: 500,
            temperature: 0.7
          }),
        });

        if (!openaiResponse.ok) {
          throw new Error(`OpenAI API error: ${openaiResponse.status}`);
        }

        const openaiData = await openaiResponse.json();
        response = openaiData.choices[0].message.content;

        console.log('OpenAI response generated successfully');
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        // Fallback to intelligent response
        response = generateIntelligentResponse(message, context);
      }
    } else {
      // Fallback to intelligent response system
      response = generateIntelligentResponse(message, context);
    }

    // Log the interaction if userId is provided
    if (userId) {
      try {
        await supabase
          .from('chat_logs')
          .insert({
            user_id: userId,
            message: message,
            response: response,
            created_at: new Date().toISOString()
          });
      } catch (logError) {
        console.error('Error logging chat:', logError);
        // Continue without logging
      }
    }

    return new Response(JSON.stringify({ 
      response,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-mentor-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateIntelligentResponse(message: string, context: any): string {
  const lowerMessage = message.toLowerCase();
  
  // Career guidance responses
  if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('future')) {
    return `I'd be happy to help you with career guidance! Based on your interests and strengths, I can suggest suitable career paths. 

Some questions to help me guide you better:
- What subjects do you enjoy most?
- Are you more interested in technical fields, creative work, or helping people?
- Do you prefer working with your hands, analyzing data, or leading teams?

Popular career options for Indian students include:
🔧 Engineering (Software, Mechanical, Civil, Electronics)
🏥 Healthcare (Medicine, Nursing, Pharmacy, Physiotherapy)  
💼 Business & Finance (MBA, CA, Banking, Marketing)
🎨 Creative Fields (Design, Media, Architecture)
🏛️ Government Services (IAS, IPS, Banking, Teaching)

Would you like me to explore any specific field with you?`;
  }

  // Exam preparation responses
  if (lowerMessage.includes('exam') || lowerMessage.includes('jee') || lowerMessage.includes('neet') || lowerMessage.includes('preparation')) {
    return `Exam preparation is crucial for your success! Here's my advice:

📚 **Study Strategy:**
- Create a structured timetable with all subjects
- Focus on NCERT books as your foundation
- Practice previous year papers regularly
- Take mock tests weekly

⏰ **Time Management:**
- Study in 2-3 hour focused sessions
- Take 15-minute breaks between sessions
- Reserve time for revision and weak topics

🎯 **Key Tips:**
- Start early - consistency beats cramming
- Join a good coaching institute if needed
- Form study groups with serious students
- Stay healthy with proper sleep and exercise

Which specific exam are you preparing for? I can provide more targeted advice based on your goal!`;
  }

  // Stress and mental health responses
  if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('pressure') || lowerMessage.includes('worried')) {
    return `I understand you're feeling stressed - this is completely normal for students! Here's how to manage it:

🧘 **Immediate Relief:**
- Take 5 deep breaths when feeling overwhelmed
- Go for a 10-minute walk outside
- Listen to calming music or practice meditation
- Talk to a trusted friend or family member

📝 **Long-term Management:**
- Break big goals into smaller, manageable tasks
- Celebrate small wins and progress
- Maintain a regular sleep schedule (7-8 hours)
- Exercise regularly, even if just 20 minutes daily

💭 **Perspective Shift:**
- Remember that exams don't define your worth
- There are multiple paths to success
- Focus on your effort, not just results
- Learn from setbacks - they're part of growth

If stress becomes overwhelming, don't hesitate to talk to a counselor or call a helpline. Your mental health is just as important as your academic success!

What specific situation is causing you stress? I'm here to help you work through it.`;
  }

  // College and course selection
  if (lowerMessage.includes('college') || lowerMessage.includes('course') || lowerMessage.includes('stream') || lowerMessage.includes('subject')) {
    return `Choosing the right course and college is a big decision! Let me help you think through this:

🎓 **Course Selection Factors:**
- Your interests and natural strengths
- Career prospects and job market demand
- Your academic performance and capabilities
- Financial considerations and family situation

🏫 **College Research:**
- Check NIRF rankings for quality assessment
- Look at placement records and alumni success
- Consider location, fees, and facilities
- Visit campuses if possible to get a feel

📊 **Popular Streams & Opportunities:**
- **Science:** Engineering, Medicine, Research, IT
- **Commerce:** CA, MBA, Banking, Economics  
- **Humanities:** Civil Services, Law, Journalism, Psychology

💡 **My Advice:**
- Don't just follow trends - choose what excites you
- Consider emerging fields like Data Science, Digital Marketing
- Keep backup options and multiple college applications
- Talk to professionals in fields you're considering

What specific courses or colleges are you considering? I can help you evaluate your options!`;
  }

  // General encouragement and motivation
  if (lowerMessage.includes('help') || lowerMessage.includes('confused') || lowerMessage.includes('don\'t know')) {
    return `I'm here to support you on your educational journey! It's completely normal to feel confused or uncertain about your future - many successful people have been in your shoes.

🌟 **Remember:**
- Every expert was once a beginner
- It's okay to change direction as you learn more about yourself
- Success comes in many different forms
- Your journey is unique to you

🎯 **How I Can Help You:**
- Career exploration and guidance
- Study strategies and exam preparation tips  
- College and course selection advice
- Scholarship and financial aid information
- Stress management and motivation
- Skill development recommendations

📝 **Let's Start Simple:**
What's one specific area where you'd like guidance today? For example:
- "I want to know about engineering careers"
- "How do I prepare for NEET?"
- "I'm stressed about board exams"
- "Which colleges should I consider?"

Take your time, and remember - asking for help is a sign of wisdom, not weakness! 💪`;
  }

  // Default response
  return `Hello! I'm your AI Career Mentor, and I'm excited to help you navigate your educational and career journey! 

I can assist you with:
🎯 Career exploration and planning
📚 Study strategies and exam preparation  
🏫 College and course selection
💰 Scholarships and financial guidance
🧘 Stress management and motivation
💼 Skill development and industry insights

As someone focused on Indian education and opportunities, I understand the unique challenges and opportunities you face.

What would you like to explore today? Feel free to ask me anything about your studies, career concerns, or future plans. I'm here to provide practical, encouraging guidance tailored to your needs!

For example, you could ask:
- "What career options do I have after 12th science?"
- "How should I prepare for competitive exams?"
- "I'm feeling overwhelmed with studies, can you help?"
- "Which engineering branch has good job prospects?"

Let's start this conversation! What's on your mind? 😊`;
}