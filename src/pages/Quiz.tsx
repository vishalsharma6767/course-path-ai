import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { GraduationCap, ArrowLeft, ArrowRight, Brain, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  category: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'Which type of activities do you find most engaging?',
    options: [
      'Solving complex mathematical problems',
      'Creative writing and storytelling',
      'Conducting scientific experiments',
      'Analyzing business trends and markets'
    ],
    category: 'interests'
  },
  {
    id: '2',
    question: 'What motivates you most in your studies?',
    options: [
      'Understanding how things work technically',
      'Making a positive impact on society',
      'Building and creating innovative solutions',
      'Working with people and teams'
    ],
    category: 'motivation'
  },
  {
    id: '3',
    question: 'In a group project, you naturally tend to:',
    options: [
      'Take charge and organize the team',
      'Research and analyze the data',
      'Come up with creative ideas',
      'Ensure everyone\'s opinions are heard'
    ],
    category: 'personality'
  },
  {
    id: '4',
    question: 'Which career environment appeals to you most?',
    options: [
      'High-tech laboratory or research facility',
      'Dynamic business office with teams',
      'Creative studio or workshop',
      'Healthcare or social service setting'
    ],
    category: 'environment'
  },
  {
    id: '5',
    question: 'Your ideal work would involve:',
    options: [
      'Developing software or technology',
      'Managing projects and people',
      'Researching and discovering new knowledge',
      'Helping others solve their problems'
    ],
    category: 'work_type'
  },
  {
    id: '6',
    question: 'Which subject area has always interested you most?',
    options: [
      'Mathematics and Physics',
      'Business and Economics',
      'Arts and Literature',
      'Biology and Chemistry'
    ],
    category: 'subjects'
  },
  {
    id: '7',
    question: 'When facing a challenge, you prefer to:',
    options: [
      'Analyze it systematically step by step',
      'Brainstorm multiple creative solutions',
      'Seek advice from experts or mentors',
      'Take immediate action and learn as you go'
    ],
    category: 'problem_solving'
  },
  {
    id: '8',
    question: 'Your long-term career goal is to:',
    options: [
      'Become an expert specialist in your field',
      'Lead and manage a successful organization',
      'Make groundbreaking discoveries or innovations',
      'Make a meaningful difference in people\'s lives'
    ],
    category: 'goals'
  }
];

const Quiz = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/');
        return;
      }
      setUser(session.user);
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;
  const canProceed = answers[quizQuestions[currentQuestion]?.id];

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmitQuiz();
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [quizQuestions[currentQuestion].id]: value
    }));
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    
    try {
      // Call the AI course recommendation edge function
      const { data, error } = await supabase.functions.invoke('recommend-course', {
        body: { 
          answers,
          userId: user?.id 
        }
      });

      if (error) throw error;

      toast({
        title: "Quiz Completed!",
        description: "Your course recommendations are ready. Redirecting to results...",
      });

      // Navigate to results page (we'll create this next)
      navigate('/results');
    } catch (error) {
      console.error('Quiz submission error:', error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error processing your quiz. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const question = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              Catalyst
            </h1>
          </div>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">AI Aptitude Assessment</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Answer honestly to get the most accurate course recommendations.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-xl">
              {question?.question}
            </CardTitle>
            <CardDescription>
              Select the option that best describes you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={answers[question?.id] || ''} 
              onValueChange={handleAnswerChange}
              className="space-y-4"
            >
              {question?.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label 
                    htmlFor={`option-${index}`}
                    className="cursor-pointer flex-1 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    {option}
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
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button 
            variant={isLastQuestion ? "hero" : "default"}
            onClick={handleNext}
            disabled={!canProceed || submitting}
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLastQuestion ? 'Get My Recommendations' : 'Next'}
            {!isLastQuestion && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;