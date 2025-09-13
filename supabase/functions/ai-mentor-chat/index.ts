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
        const systemPrompt = `You are an expert AI Study Mentor and Career Advisor specifically designed for Indian students. You provide comprehensive, personalized guidance across all aspects of student life, academics, and career planning.

🎓 **CORE EXPERTISE:**
- **Academic Excellence**: Study techniques (Pomodoro, spaced repetition, active recall), subject mastery strategies, exam preparation
- **Indian Education System**: Detailed knowledge of CBSE, ICSE, State boards, 10th/12th streams, UG/PG programs
- **Competitive Exams**: JEE (Main/Advanced), NEET, GATE, CAT, CLAT, UPSC, SSC, Banking, Railways, State CETs
- **Career Guidance**: Engineering, Medical, Commerce, Arts, Government jobs, Private sector, Entrepreneurship
- **College Selection**: IITs, NITs, IIMs, Medical colleges, State universities, Private institutions
- **Financial Planning**: Scholarships (NSP, PM-YASASVI, Merit-based), Education loans, Cost analysis

🧠 **SPECIALIZED SUPPORT:**
- **Study Psychology**: Motivation techniques, goal setting, overcoming procrastination, building discipline
- **Mental Health**: Stress management, exam anxiety, work-life balance, confidence building  
- **Time Management**: Smart timetables, productivity systems, habit formation
- **Life Skills**: Communication, leadership, critical thinking, problem-solving

🇮🇳 **INDIAN CONTEXT MASTERY:**
- Reservation policies (SC/ST/OBC/EWS quotas and processes)
- Regional opportunities and state-specific programs
- Cultural considerations and family dynamics in education
- Current industry trends and job market insights
- Government schemes and initiatives for students

**RESPONSE GUIDELINES:**
✅ **Always provide:**
- Practical, actionable steps the student can implement immediately
- Multiple options and alternatives to avoid tunnel vision
- Specific Indian examples, institutions, and resources
- Encouragement balanced with realistic expectations
- Follow-up questions to understand their specific situation better

✅ **Format responses with:**
- Clear structure using headings, bullet points, and emojis
- Step-by-step guidance when appropriate
- Relevant statistics or success stories when helpful
- Next action items or recommended resources

✅ **Tone & Approach:**
- Warm, supportive, and understanding like a caring mentor
- Professional yet approachable
- Culturally sensitive to Indian values and family expectations
- Motivational without being overly optimistic about challenges

**Current Student Context:** ${context ? JSON.stringify(context) : 'General guidance requested'}

Remember: Every student's journey is unique. Provide personalized advice that considers their specific circumstances, goals, and challenges. Be the mentor you wish you had during your own academic journey!`;

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-5-2025-08-07',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message }
            ],
            max_completion_tokens: 800,
            stream: false
          }),
        });

        if (!openaiResponse.ok) {
          const errorText = await openaiResponse.text();
          console.error(`OpenAI API error ${openaiResponse.status}:`, errorText);
          
          if (openaiResponse.status === 429) {
            // Rate limit exceeded - use enhanced fallback
            console.log('Rate limit exceeded, using enhanced fallback response');
            response = generateEnhancedIntelligentResponse(message, context);
          } else {
            throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorText}`);
          }
        } else {
          const openaiData = await openaiResponse.json();
          response = openaiData.choices[0]?.message?.content || 'I apologize, but I received an empty response. Please try asking your question again.';
          console.log('OpenAI response generated successfully');
        }
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        // Fallback to enhanced intelligent response
        response = generateEnhancedIntelligentResponse(message, context);
      }
    } else {
      console.log('No OpenAI API key found, using enhanced fallback system');
      // Fallback to enhanced intelligent response system
      response = generateEnhancedIntelligentResponse(message, context);
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

function generateEnhancedIntelligentResponse(message: string, context: any): string {
  const lowerMessage = message.toLowerCase();
  console.log('Generating enhanced response for:', message.substring(0, 50) + '...');
  
  // Career guidance responses - Enhanced with more specific advice
  if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('future') || lowerMessage.includes('what should i do')) {
    return `🎯 **Career Guidance - Let's Find Your Perfect Path!**

I'm excited to help you discover your ideal career! Every successful person started where you are now - with questions and curiosity.

**🔍 Quick Career Assessment:**
Let's understand YOU better first:
• **Subjects you excel in?** (Math, Science, Languages, Arts)  
• **Activities you enjoy?** (Problem-solving, helping others, creating, leading)
• **Work environment preference?** (Office, outdoors, travel, remote)
• **Long-term vision?** (Financial stability, social impact, innovation, entrepreneurship)

**🚀 Top Career Paths for Indian Students (2025):**

**💻 Technology & IT:**
• Software Development (₹6-50 LPA)
• Data Science & AI (₹8-60 LPA)  
• Cybersecurity (₹7-40 LPA)
• Cloud Computing (₹6-45 LPA)

**🏥 Healthcare & Life Sciences:**
• Medicine/MBBS (₹8-100+ LPA)
• Nursing & Allied Health (₹3-15 LPA)
• Biotechnology (₹4-25 LPA)
• Pharmacy (₹3-20 LPA)

**🏗️ Engineering & Technical:**
• Software Engineering (₹6-80 LPA)
• Civil Engineering (₹3-20 LPA)
• Mechanical Engineering (₹4-25 LPA)
• Electronics (₹5-30 LPA)

**💼 Business & Finance:**
• Chartered Accountancy (₹6-50 LPA)
• Investment Banking (₹10-100 LPA)
• Digital Marketing (₹3-25 LPA)
• Management Consulting (₹8-60 LPA)

**🏛️ Government & Public Service:**
• IAS/IPS/IFS (₹7-50 LPA + perks)
• Banking (₹3-15 LPA)
• Railways (₹3-12 LPA)
• Defense Services (₹6-20 LPA + benefits)

**❓ What resonates with you?** Share your interests and I'll give you a detailed roadmap with specific steps, colleges, and preparation strategies!`;
  }

  // Enhanced exam preparation responses with specific strategies
  if (lowerMessage.includes('exam') || lowerMessage.includes('jee') || lowerMessage.includes('neet') || lowerMessage.includes('board') || lowerMessage.includes('competitive') || lowerMessage.includes('preparation') || lowerMessage.includes('study')) {
    return `📚 **Exam Success Masterplan - Your Complete Strategy!**

Whether it's boards, JEE, NEET, or any competitive exam, I've got you covered with proven strategies that work!

**🎯 THE WINNING FORMULA:**

**📅 Phase 1: Foundation Building (60% time)**
• **NCERT Mastery**: Read every line 3 times minimum
• **Concept Clarity**: Understand WHY, not just WHAT  
• **Daily Practice**: 50 problems/questions per subject
• **Doubt Resolution**: Same day - never accumulate!

**⚡ Phase 2: Skill Development (25% time)**
• **Speed Building**: Time yourself on every problem
• **Pattern Recognition**: Identify recurring question types
• **Shortcut Techniques**: Learn smart methods for quick solving
• **Mock Tests**: 2 full tests per week minimum

**🔄 Phase 3: Mastery & Revision (15% time)**
• **Error Analysis**: Maintain mistake diary
• **Weak Topic Focus**: Extra 2 hours daily on weak areas
• **Rapid Revision**: Complete syllabus in 7 days
• **Stress Management**: Meditation + exercise daily

**⏰ DAILY STUDY SCHEDULE TEMPLATE:**
• **5:30-6:30 AM**: Toughest subject (peak brain power)
• **7:00-9:00 AM**: Medium difficulty subject  
• **10:00-12:00 PM**: Problem solving & practice
• **2:00-4:00 PM**: Easy subject + revision
• **5:00-7:00 PM**: Mock tests / previous years
• **8:00-9:00 PM**: Review + next day planning

**🏆 SUCCESS MULTIPLIERS:**
✅ **Study Group**: Form with 3-4 serious students
✅ **Coaching**: Join if self-study isn't working
✅ **Mentorship**: Find a successful senior/teacher
✅ **Technology**: Use apps for time tracking & tests
✅ **Health**: 7+ hours sleep, daily exercise, proper nutrition

**🎪 EXAM-SPECIFIC STRATEGIES:**

**For JEE:** Physics (numerical mastery) + Chemistry (reaction mechanisms) + Math (speed + accuracy)
**For NEET:** Biology (diagram-based) + Chemistry (NCERT focus) + Physics (concept application)
**For Boards:** NCERT + sample papers + neat presentation

**Which specific exam are you targeting?** Tell me and I'll create a personalized 90-day action plan for you! 🚀`;
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