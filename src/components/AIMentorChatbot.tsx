import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bot, Send, X, MessageCircle, User, Calendar, BookOpen, Target, Clock } from 'lucide-react';
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
      text: 'Namaste! 🙏 I\'m your AI mentor for Indian education and career guidance. I can help you with:\n\n📚 Study techniques (Pomodoro, spaced repetition)\n🎯 Career planning and goal setting\n📅 Smart timetable generation\n💡 Motivational guidance\n🏫 College and course selection\n📈 Progress tracking\n\nLet\'s start by understanding your needs! What subjects are you currently studying?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTimetableGenerator, setShowTimetableGenerator] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
      
      // Fallback to local response
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(currentMessage),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
      
      toast({
        title: "Connection Issue",
        description: "Using offline responses. Check your internet connection for full AI features.",
        variant: "default",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50 bg-gradient-to-r from-primary to-primary-foreground"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary-foreground flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-lg">AI Study Mentor</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Get guidance on Indian education, careers & smart timetables
        </p>
        {/* Quick Action Buttons */}
        <div className="flex space-x-1 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTimetableGenerator(true)}
            className="text-xs"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Timetable
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const motivationMsg = "I need some motivation and study tips!";
              setInputMessage(motivationMsg);
              handleSendMessage();
            }}
            className="text-xs"
          >
            <Target className="h-3 w-3 mr-1" />
            Motivate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const techniqueMsg = "What are the best study techniques?";
              setInputMessage(techniqueMsg);
              handleSendMessage();
            }}
            className="text-xs"
          >
            <BookOpen className="h-3 w-3 mr-1" />
            Techniques
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4 pt-0 space-y-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isBot ? 'bg-primary' : 'bg-secondary'
                  }`}>
                    {message.isBot ? (
                      <Bot className="h-3 w-3 text-white" />
                    ) : (
                      <User className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                      message.isBot
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-primary text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about studies, timetables, motivation..."
            className="flex-1"
          />
          <Dialog open={showTimetableGenerator} onOpenChange={setShowTimetableGenerator}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Smart Timetable Generator</DialogTitle>
              </DialogHeader>
              <SmartTimetableGenerator user={user} />
            </DialogContent>
          </Dialog>
          <Button onClick={handleSendMessage} size="icon" disabled={!inputMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIMentorChatbot;