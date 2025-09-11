import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X, MessageCircle, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { User as AuthUser } from '@supabase/supabase-js';

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
      text: 'Namaste! I\'m your AI mentor for Indian education and career guidance. I can help you with government schemes, Indian colleges, career paths, and educational opportunities in India. How can I assist you today?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
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
            platform: 'Catalyst Career Guidance'
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
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
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
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-lg">AI Education Mentor</CardTitle>
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
        <p className="text-sm text-muted-foreground">Get guidance on Indian education & careers</p>
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
            placeholder="Ask about Indian colleges, government schemes..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon" disabled={!inputMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIMentorChatbot;