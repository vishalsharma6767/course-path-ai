async function generateEnhancedIntelligentResponse(message: string, context: any, openaiApiKey?: string): Promise<string> {
  const lowerMessage = message.toLowerCase();
  console.log('Generating enhanced response for:', message.substring(0, 50) + '...');

  // --- Career Guidance ---
  if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('future') || lowerMessage.includes('what should i do')) {
    return `🎯 **Career Guidance - Let's Find Your Perfect Path!**

[... keep your detailed career guidance text here ...]`;
  }

  // --- Exam Preparation ---
  if (lowerMessage.includes('exam') || lowerMessage.includes('jee') || lowerMessage.includes('neet') || lowerMessage.includes('board') || lowerMessage.includes('competitive') || lowerMessage.includes('preparation') || lowerMessage.includes('study')) {
    return `📚 **Exam Success Masterplan - Your Complete Strategy!**

[... keep your detailed exam preparation text here ...]`;
  }

  // --- Stress & Mental Health ---
  if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('pressure') || lowerMessage.includes('worried')) {
    return `🧘 **Stress Management Plan**

[... keep your stress response here ...]`;
  }

  // --- College / Course Selection ---
  if (lowerMessage.includes('college') || lowerMessage.includes('course') || lowerMessage.includes('stream') || lowerMessage.includes('subject')) {
    return `🎓 **Course & College Decision Guide**

[... keep your college response here ...]`;
  }

  // --- Confusion / Help ---
  if (lowerMessage.includes('help') || lowerMessage.includes('confused') || lowerMessage.includes('don\'t know')) {
    return `🌟 **Don’t worry, I’m here for you!**

[... keep your help response here ...]`;
  }

  // --- Default Response with API Call ---
  if (openaiApiKey) {
    try {
      console.log("Falling back to OpenAI API for default response...");
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',  // stable lightweight model
          messages: [
            { role: 'system', content: "You are a friendly AI mentor for Indian students. Provide detailed, practical, and motivating advice." },
            { role: 'user', content: message }
          ],
          max_tokens: 600,
        }),
      });

      if (openaiResponse.ok) {
        const data = await openaiResponse.json();
        return data.choices[0]?.message?.content || "I’m here, but didn’t get a proper response. Try rephrasing your question.";
      }
    } catch (err) {
      console.error("OpenAI default response error:", err);
    }
  }

  // --- Final Static Fallback (if API also fails) ---
  return `🌟 **Hello! I’m your AI Mentor & Career Guide** 🌟  

I’m here to provide **personalized support** for your education, career, and life journey.  

📚 Academics → Study timetables, resources, exam hacks  
🎯 Career → Streams, colleges, scholarships, jobs  
🧠 Mindset → Motivation, stress management, confidence  
💼 Skills → AI, coding, design, business, communication  

✅ Tell me about yourself (school/college/job, your interests), and I’ll create a **step-by-step plan** just for you 🚀`;
}
