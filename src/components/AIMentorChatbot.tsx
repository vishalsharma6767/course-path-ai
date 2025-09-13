import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, MessageCircle, User, Calendar, BookOpen, Target, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { User as AuthUser } from '@supabase/supabase-js';
import SmartTimetableGenerator from './SmartTimetableGenerator';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const AIMentorChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🙏 **Namaste! I\'m your AI Study Mentor**\n\nI\'m here to help you excel in your studies with personalized guidance tailored for Indian students. I can assist with:\n\n✨ **Study Techniques & Time Management**\n📚 Pomodoro method, spaced repetition, active recall\n📅 Smart timetable generation\n\n🎯 **Career & Academic Planning**\n💡 JEE/NEET/Board exam strategies\n🏫 College selection and course guidance\n💪 Motivation and goal setting\n\n📈 **Progress Tracking**\n📊 Performance analytics\n🎪 Study habit optimization\n\n**Let\'s get started!** What would you like to work on today?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTimetableGenerator, setShowTimetableGenerator] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get current user and profile
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        // Fetch user profile for personalized responses
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        setUserProfile(profile);
      }
    };
    getUser();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Timetable and study planning responses
    if (lowerMessage.includes('timetable') || lowerMessage.includes('schedule') || lowerMessage.includes('plan') || lowerMessage.includes('time management')) {
      return `I'd love to help you create a personalized study timetable! 📅\n\n**Study Techniques I can suggest:**\n🍅 **Pomodoro Technique**: 25min focused study + 5min break\n📚 **Spaced Repetition**: Review material at increasing intervals\n🎯 **Active Recall**: Test yourself instead of just re-reading\n⭐ **Interleaving**: Mix different subjects in one session\n\n**For a personalized timetable, I need to know:**\n• What subjects are you studying?\n• How many hours can you study daily?\n• Do you have any extracurricular activities?\n• Any upcoming exams with specific dates?\n\nWould you like me to generate a smart timetable for you? Just tell me your subjects and available time!`;
    }

    // Study techniques and motivation
    if (lowerMessage.includes('study technique') || lowerMessage.includes('how to study') || lowerMessage.includes('focus') || lowerMessage.includes('concentration')) {
      return `Here are proven study techniques for Indian students! 🎯\n\n**🍅 Pomodoro Technique:**\n• Study for 25 minutes with full focus\n• Take a 5-minute break\n• After 4 sessions, take a 30-minute break\n• Perfect for maintaining concentration!\n\n**📚 Spaced Repetition:**\n• Review new material after 1 day, 3 days, 1 week, 2 weeks\n• Great for competitive exams like JEE/NEET\n• Use apps like Anki for flashcards\n\n**🎯 Active Learning:**\n• Teach concepts to someone else\n• Create mind maps and flowcharts\n• Practice with previous year papers\n• Join study groups for discussion\n\n**⏰ Time Blocking:**\n• Assign specific time slots to each subject\n• Include breaks and buffer time\n• Prioritize difficult topics during peak energy hours\n\nWant me to create a personalized study schedule for you?`;
    }

    // Motivational and goal-setting responses
    if (lowerMessage.includes('motivation') || lowerMessage.includes('goal') || lowerMessage.includes('demotivated') || lowerMessage.includes('lazy')) {
      return `I understand the ups and downs of student life! Let me help you stay motivated 💪\n\n**🎯 Goal Setting Framework:**\n• **Specific**: "Score 95% in Math board exam" not just "do well"\n• **Measurable**: Track daily/weekly progress\n• **Achievable**: Break big goals into smaller milestones\n• **Relevant**: Align with your career dreams\n• **Time-bound**: Set clear deadlines\n\n**💡 Daily Motivation Tips:**\n• Start with your easiest task to build momentum\n• Reward yourself after completing study sessions\n• Visualize your success and future career\n• Remember why you started this journey\n• Connect with classmates who inspire you\n\n**📈 Progress Tracking:**\n• Keep a study journal or use apps\n• Celebrate small wins daily\n• Review and adjust goals weekly\n• Share achievements with family/friends\n\nWhat specific goal are you working towards? Let me help you create an action plan!`;
    }
    
    // Government schemes responses
    if (lowerMessage.includes('scholarship') || lowerMessage.includes('government scheme')) {
      return 'Here are some key government scholarships for Indian students:\n\n• National Scholarship Portal (NSP) - For SC/ST/OBC students\n• PM-YASASVI Scheme - For OBC, EBC, DNT students\n• Central Sector Scheme - Merit-based scholarships\n• State Government Scholarships - Varies by state\n• Inspire Scholarship - For Science students\n\nWould you like detailed information about any specific scheme?';
    }
    
    if (lowerMessage.includes('iit') || lowerMessage.includes('nit') || lowerMessage.includes('engineering')) {
      return 'For Engineering in India:\n\n• IITs (23 institutes) - Through JEE Advanced\n• NITs (31 institutes) - Through JEE Main\n• IIITs - Through JEE Main\n• State Engineering Colleges - Through state CETs\n• Private colleges - Through various entrance exams\n\nReservation: SC/ST (22.5%), OBC (27%), EWS (10%)\nWould you like admission process details or fee structure?';
    }
    
    if (lowerMessage.includes('medical') || lowerMessage.includes('mbbs') || lowerMessage.includes('neet')) {
      return 'For Medical studies in India:\n\n• AIIMS - 24 institutes\n• Government Medical Colleges - Through NEET\n• Private Medical Colleges - Through NEET\n• Deemed Universities - Through NEET\n\nReservation applies. NEET score validity: 3 years\nBond requirements in some states for MBBS.\nWould you like state-wise seat matrix or fee details?';
    }
    
    if (lowerMessage.includes('job') || lowerMessage.includes('placement') || lowerMessage.includes('career')) {
      return 'Career opportunities in India:\n\n• Government Jobs: UPSC, SSC, Banking, Railways\n• IT Industry: High demand for software professionals\n• Healthcare: Growing opportunities post-COVID\n• Digital Marketing: Emerging field with good prospects\n• Manufacturing: Make in India initiative\n\nSkill development through:\n• Skill India Mission\n• PMKVY schemes\n• Industry partnerships\n\nWhich sector interests you most?';
    }
    
    if (lowerMessage.includes('state') || lowerMessage.includes('location') || lowerMessage.includes('city')) {
      return 'Education hubs in India:\n\n• Delhi NCR - DU, JNU, IIT Delhi, Medical colleges\n• Bangalore - IISc, IIMs, IT companies\n• Hyderabad - ISB, IIIT, Pharma companies\n• Chennai - IIT Madras, Medical colleges\n• Pune - Engineering colleges, IT hub\n• Mumbai - IIT Bombay, Finance sector\n• Kolkata - JU, Medical colleges\n\nConsider factors like cost of living, language, climate, and industry presence. Which state/region are you considering?';
    }
    
    // Default responses
    const responses = [
      'That\'s an interesting question about Indian education. Can you be more specific about what aspect you\'d like to know?',
      'I\'d be happy to help with your educational journey in India. Could you provide more details?',
      'For personalized guidance, consider factors like your interests, financial situation, and career goals. What specific area interests you?',
      'India offers diverse educational opportunities. Are you looking for undergraduate, postgraduate, or professional courses?'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Add a slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Call the AI mentor chat edge function
      const { data, error } = await supabase.functions.invoke('ai-mentor-chat', {
        body: {
          message: currentMessage,
          userId: user?.id,
          context: {
            isStudent: true,
            platform: 'Catalyst Career Guidance',
            userProfile: userProfile,
            subjects: userProfile?.interests || [],
            class: userProfile?.class
          }
        },
      });

      if (error) throw error;

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'I apologize, but I encountered an issue generating a response. Please try asking your question again.',
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Enhanced fallback with better responses
      const enhancedResponse = getEnhancedAIResponse(currentMessage);
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: enhancedResponse,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const getEnhancedAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Enhanced AI-like responses with better formatting
    if (lowerMessage.includes('timetable') || lowerMessage.includes('schedule') || lowerMessage.includes('plan')) {
      return `📅 **Let's create your perfect study timetable!**\n\nI'll help you build a personalized schedule that maximizes your productivity. Here's what I need:\n\n**📚 Study Details:**\n• What subjects are you currently studying?\n• How many hours can you dedicate to studies daily?\n• Any upcoming exams or deadlines?\n\n**⏰ Preferences:**\n• What time do you feel most focused?\n• Do you prefer longer study sessions or shorter bursts?\n• Any extracurricular activities to include?\n\n**🎯 Study Techniques I'll incorporate:**\n• **Pomodoro Technique** (25min focus + 5min break)\n• **Spaced Repetition** for better retention\n• **Active Recall** sessions\n• **Subject Interleaving** for variety\n\nClick the **Timetable** button below to get started with our smart generator!`;
    }

    if (lowerMessage.includes('motivation') || lowerMessage.includes('demotivat') || lowerMessage.includes('lazy')) {
      return `💪 **You've got this! Let me reignite your motivation**\n\n**🌟 Remember Your Why:**\n• What dreams brought you here?\n• Visualize yourself achieving your goals\n• Every study session is a step closer to success\n\n**🎯 Instant Motivation Boosters:**\n• **Small Wins Strategy**: Start with just 15 minutes of study\n• **Progress Visualization**: Track your daily improvements\n• **Future Self**: Imagine how proud you'll be tomorrow\n• **Study Buddy**: Find someone to keep you accountable\n\n**📈 Momentum Building:**\n• Set micro-goals (1 chapter, 10 problems, 1 topic)\n• Reward yourself after each milestone\n• Create a success playlist\n• Use the "2-minute rule" - just start for 2 minutes\n\n**✨ Mindset Shift:**\nYou're not just studying - you're building your future. Every Indian student who made it big started exactly where you are now!\n\nWhat specific challenge is making you feel demotivated? Let's tackle it together!`;
    }

    if (lowerMessage.includes('study technique') || lowerMessage.includes('how to study') || lowerMessage.includes('focus')) {
      return `🧠 **Master These Proven Study Techniques**\n\n**🍅 Pomodoro Technique** (Most Popular)\n• 25 minutes focused study\n• 5-minute break\n• Repeat 4 cycles, then 30-minute break\n• Perfect for maintaining concentration\n\n**📚 Spaced Repetition** (For Long-term Retention)\n• Review after: 1 day → 3 days → 1 week → 2 weeks\n• Ideal for competitive exams like JEE/NEET\n• Use flashcards or apps like Anki\n\n**🎯 Active Recall** (Most Effective)\n• Close your book and explain the topic\n• Create questions and answer them\n• Teach someone else\n• 10x more effective than re-reading\n\n**🌈 Feynman Technique**\n• Learn → Explain in simple terms → Identify gaps → Simplify further\n• Great for understanding complex concepts\n\n**⚡ Additional Power Tips:**\n• Study in 90-minute blocks (matches brain's ultradian rhythm)\n• Use background music (lo-fi or instrumental)\n• Take handwritten notes (better memory encoding)\n• Practice retrieval, not recognition\n\nWhich technique would you like to try first?`;
    }

    if (lowerMessage.includes('jee') || lowerMessage.includes('neet') || lowerMessage.includes('engineering') || lowerMessage.includes('medical')) {
      return `🎯 **Competitive Exam Success Strategy**\n\n**For JEE/NEET Preparation:**\n\n**📊 Study Plan Framework:**\n• **Phase 1**: Concept building (60% time)\n• **Phase 2**: Problem solving (30% time)\n• **Phase 3**: Mock tests & revision (10% time)\n\n**📚 Subject-wise Strategy:**\n• **Physics**: Focus on numerical problem-solving\n• **Chemistry**: Equal emphasis on organic, inorganic, physical\n• **Mathematics**: Practice daily, focus on speed\n• **Biology** (NEET): Diagram-based learning, NCERT mastery\n\n**🎪 Exam Success Formula:**\n• **Daily**: 6-8 hours focused study\n• **Weekly**: 2 full-length mock tests\n• **Monthly**: Complete syllabus revision\n• **Previous Years**: Solve last 10 years papers\n\n**💡 Pro Tips:**\n• Join online test series\n• Form study groups for doubt clearing\n• Maintain error logs\n• Focus on your strong subjects first\n\nWhat specific exam are you preparing for? I can give you a detailed roadmap!`;
    }

    // Default enhanced response
    const responses = [
      `🤔 **That's an interesting question!**\n\nI'd love to help you with that. Could you provide a bit more context? For example:\n• Are you looking for study guidance?\n• Need help with career planning?\n• Want motivation or study techniques?\n• Have questions about specific subjects?\n\nThe more details you share, the better I can assist you! 😊`,
      `💭 **I'm here to help with your academic journey!**\n\nI specialize in:\n✨ Study strategies and time management\n🎯 Career guidance for Indian students\n📚 Exam preparation (JEE, NEET, Boards)\n💪 Motivation and goal setting\n📅 Smart timetable creation\n\nWhat specific area would you like to explore today?`,
      `🌟 **Great question!**\n\nAs your AI study mentor, I can help you with various aspects of your educational journey. Whether it's:\n\n• **Study Techniques** - Pomodoro, spaced repetition, active recall\n• **Career Planning** - Course selection, college guidance\n• **Motivation** - Goal setting and maintaining focus\n• **Time Management** - Creating effective study schedules\n\nWhat would you like to dive into first?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = async (message: string) => {
    setInputMessage(message);
    // Auto-send the message
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-xl hover:shadow-2xl transition-all z-50 bg-gradient-to-br from-primary via-primary to-primary/80 hover:scale-110 group"
        size="icon"
      >
        <div className="relative">
          <MessageCircle className="h-8 w-8 text-white" />
          <Sparkles className="h-4 w-4 text-white absolute -top-1 -right-1 animate-pulse group-hover:animate-spin" />
        </div>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center relative">
              <Bot className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Study Mentor</h1>
              <p className="text-sm text-muted-foreground">Your personal academic guidance assistant</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-10 w-10 rounded-full hover:bg-muted"
          >
            ✕
          </Button>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex space-x-2 mt-4 max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTimetableGenerator(true)}
            className="hover:bg-primary hover:text-white transition-colors"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Create Timetable
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction("I need motivation and study tips!")}
            className="hover:bg-primary hover:text-white transition-colors"
          >
            <Target className="h-4 w-4 mr-2" />
            Get Motivated
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction("What are the best study techniques for students?")}
            className="hover:bg-primary hover:text-white transition-colors"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Study Techniques
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction("Help me prepare for JEE/NEET competitive exams")}
            className="hover:bg-primary hover:text-white transition-colors"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Exam Prep
          </Button>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-4xl mx-auto p-4 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-[85%] ${
                    message.isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isBot 
                      ? 'bg-gradient-to-br from-primary to-primary/80' 
                      : 'bg-gradient-to-br from-muted-foreground to-muted-foreground/80'
                  }`}>
                    {message.isBot ? (
                      <Bot className="h-4 w-4 text-white" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-line max-w-full ${
                      message.isBot
                        ? 'bg-muted/50 text-foreground border border-border/50'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  </div>
                  <div className="bg-muted/50 border border-border/50 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      
      {/* Input Area */}
      <div className="border-t bg-background/80 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about studies, exams, timetables, motivation, career guidance..."
                className="min-h-[60px] max-h-[150px] resize-none pr-12 text-sm"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon" 
                disabled={!inputMessage.trim() || isTyping}
                className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <Dialog open={showTimetableGenerator} onOpenChange={setShowTimetableGenerator}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Calendar className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Smart Timetable Generator</DialogTitle>
                </DialogHeader>
                <SmartTimetableGenerator user={user} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMentorChatbot;