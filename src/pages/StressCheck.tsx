import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Brain, Heart, Shield, Phone, MessageCircle, Calendar, Activity } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

const StressCheck = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [stressLevel, setStressLevel] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate('/');
      }
      setLoading(false);
    };
    checkSession();
  }, [navigate]);

  const questions = [
    {
      id: 1,
      text: "How often do you feel overwhelmed by your studies?",
      options: [
        { value: 0, text: "Never" },
        { value: 1, text: "Rarely" },
        { value: 2, text: "Sometimes" },
        { value: 3, text: "Often" },
        { value: 4, text: "Always" }
      ]
    },
    {
      id: 2,
      text: "How well are you sleeping recently?",
      options: [
        { value: 0, text: "Very well (7-8 hours)" },
        { value: 1, text: "Well (6-7 hours)" },
        { value: 2, text: "Okay (5-6 hours)" },
        { value: 3, text: "Poorly (4-5 hours)" },
        { value: 4, text: "Very poorly (less than 4 hours)" }
      ]
    },
    {
      id: 3,
      text: "How often do you worry about your future career?",
      options: [
        { value: 0, text: "Never" },
        { value: 1, text: "Rarely" },
        { value: 2, text: "Sometimes" },
        { value: 3, text: "Often" },
        { value: 4, text: "Constantly" }
      ]
    },
    {
      id: 4,
      text: "How do you feel about your academic performance?",
      options: [
        { value: 0, text: "Very satisfied" },
        { value: 1, text: "Satisfied" },
        { value: 2, text: "Neutral" },
        { value: 3, text: "Dissatisfied" },
        { value: 4, text: "Very dissatisfied" }
      ]
    },
    {
      id: 5,
      text: "How often do you feel anxious or nervous?",
      options: [
        { value: 0, text: "Never" },
        { value: 1, text: "Rarely" },
        { value: 2, text: "Sometimes" },
        { value: 3, text: "Often" },
        { value: 4, text: "Daily" }
      ]
    },
    {
      id: 6,
      text: "How well can you concentrate on your studies?",
      options: [
        { value: 0, text: "Excellent focus" },
        { value: 1, text: "Good focus" },
        { value: 2, text: "Average focus" },
        { value: 3, text: "Poor focus" },
        { value: 4, text: "Cannot focus at all" }
      ]
    }
  ];

  const handleAnswerChange = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion]: parseInt(value) };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateStressLevel();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateStressLevel = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 4;
    const percentage = (totalScore / maxScore) * 100;
    setStressLevel(percentage);
    setShowResults(true);
  };

  const getStressCategory = (level: number) => {
    if (level <= 20) return { category: "Low", color: "text-green-600", bg: "bg-green-50" };
    if (level <= 40) return { category: "Mild", color: "text-yellow-600", bg: "bg-yellow-50" };
    if (level <= 60) return { category: "Moderate", color: "text-orange-600", bg: "bg-orange-50" };
    if (level <= 80) return { category: "High", color: "text-red-600", bg: "bg-red-50" };
    return { category: "Very High", color: "text-red-700", bg: "bg-red-100" };
  };

  const relaxationTips = {
    "Low": [
      "Continue your current healthy habits",
      "Practice gratitude journaling",
      "Maintain regular exercise",
      "Keep a consistent sleep schedule"
    ],
    "Mild": [
      "Try 5-minute breathing exercises",
      "Take short breaks during study sessions",
      "Practice mindfulness meditation",
      "Connect with friends and family"
    ],
    "Moderate": [
      "Implement the Pomodoro Technique",
      "Try progressive muscle relaxation",
      "Consider talking to a counselor",
      "Join stress management workshops"
    ],
    "High": [
      "Practice deep breathing exercises daily",
      "Consider professional counseling",
      "Reduce workload where possible",
      "Focus on self-care activities"
    ],
    "Very High": [
      "Seek immediate professional help",
      "Contact college counseling services",
      "Practice crisis breathing techniques",
      "Reach out to trusted friends/family"
    ]
  };

  const emergencyContacts = [
    { name: "National Mental Health Helpline", number: "1800-599-0019", available: "24/7" },
    { name: "Student Helpline", number: "1075", available: "24/7" },
    { name: "Youth Helpline", number: "1098", available: "24/7" },
    { name: "Crisis Helpline", number: "9152987821", available: "24/7" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showResults) {
    const stressInfo = getStressCategory(stressLevel);
    
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Stress Assessment Results</h1>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Results Summary */}
          <Card className={`mb-8 ${stressInfo.bg} border-2`}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-white rounded-full w-fit">
                <Activity className={`h-12 w-12 ${stressInfo.color}`} />
              </div>
              <CardTitle className="text-2xl">Your Stress Level: {stressInfo.category}</CardTitle>
              <CardDescription className="text-lg">
                Based on your responses, here's your personalized assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold mb-2">{Math.round(stressLevel)}%</div>
                <Progress value={stressLevel} className="w-full max-w-md mx-auto" />
              </div>
            </CardContent>
          </Card>

          {/* Personalized Tips */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Personalized Relaxation Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relaxationTips[stressInfo.category as keyof typeof relaxationTips].map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-background rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-elegant transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Brain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Breathing Exercise</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">5-minute guided breathing</p>
                <Button className="w-full">Start Now</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elegant transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Talk to Counselor</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Free professional guidance</p>
                <Button className="w-full">Book Session</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elegant transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Stress Management</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Weekly workshops</p>
                <Button className="w-full">Join Program</Button>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Contacts */}
          {stressLevel > 60 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <Phone className="h-5 w-5 mr-2" />
                  Need Immediate Help?
                </CardTitle>
                <CardDescription className="text-red-600">
                  Don't hesitate to reach out - help is always available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.available}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Call {contact.number}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center mt-8">
            <Button onClick={() => {
              setCurrentQuestion(0);
              setAnswers({});
              setShowResults(false);
            }}>
              Retake Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">AI Stress Check</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Mental Wellness Assessment</h2>
          <p className="text-muted-foreground text-lg">
            Let's check how you're feeling and provide personalized support
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">{questions[currentQuestion].text}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={answers[currentQuestion]?.toString() || ""} 
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {questions[currentQuestion].options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                  <Label htmlFor={`option-${option.value}`} className="cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            disabled={answers[currentQuestion] === undefined}
          >
            {currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StressCheck;