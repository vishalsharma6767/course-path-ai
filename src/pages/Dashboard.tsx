import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, BookOpen, Users, Trophy, Brain, LogOut, ArrowRight, Building, Award, TrendingUp, Lock, MapPin, FileText, Briefcase, Globe, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';
import AIMentorChatbot from '@/components/AIMentorChatbot';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        
        // Check if user has completed quiz
        const { data: quizData } = await supabase
          .from('quiz_results')
          .select('id')
          .eq('user_id', session.user.id)
          .limit(1);
        
        setQuizCompleted(quizData && quizData.length > 0);
      } else {
        navigate('/');
      }
      setLoading(false);
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          setUser(null);
          navigate('/');
        } else {
          setUser(session.user);
        }
      }
    );

    checkSession();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "Come back soon to continue your course discovery!",
    });
  };

  const startQuiz = () => {
    navigate('/quiz');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

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
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.user_metadata?.name || user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h2>
          <p className="text-muted-foreground text-lg">
            Let's discover your perfect course and plan your academic future!
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 gradient-hero text-white">
          <CardHeader>
            <CardTitle className="text-white">Your Journey Progress</CardTitle>
            <CardDescription className="text-white/80">
              Complete each step to get comprehensive course guidance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Profile Setup</span>
                <span className="text-sm bg-white/20 px-2 py-1 rounded">Complete</span>
              </div>
              <div className="flex items-center justify-between">
                <span>AI Aptitude Quiz</span>
                <span className="text-sm bg-white/20 px-2 py-1 rounded">Pending</span>
              </div>
              <Progress value={25} className="h-2 bg-white/20" />
              <p className="text-sm text-white/80">1 of 4 steps completed</p>
            </div>
          </CardContent>
        </Card>

        {/* Main Actions - Updated with unlock system */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* AI Quiz Card */}
          <Card 
            className={`hover:shadow-elegant transition-shadow cursor-pointer ${
              quizCompleted ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : ''
            }`} 
            onClick={() => navigate('/quiz')}
          >
            <CardHeader>
              <Brain className={`h-12 w-12 mb-2 ${quizCompleted ? 'text-green-600' : 'text-primary'}`} />
              <CardTitle className={quizCompleted ? 'text-green-600' : ''}>
                AI Aptitude Quiz {quizCompleted && '✓'}
              </CardTitle>
              <CardDescription>
                {quizCompleted ? 'Quiz completed! View results' : 'Take our intelligent assessment to get personalized course recommendations'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                {quizCompleted ? 'View Results' : 'Begin Assessment'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* College Finder Card */}
          <Card 
            className={`hover:shadow-elegant transition-shadow ${
              quizCompleted ? 'cursor-pointer' : 'opacity-60'
            }`}
            onClick={quizCompleted ? () => navigate('/colleges') : undefined}
          >
            <CardHeader>
              <Building className={`h-12 w-12 mb-2 ${quizCompleted ? 'text-primary' : 'text-muted-foreground'}`} />
              <CardTitle className={quizCompleted ? '' : 'text-muted-foreground'}>
                College Finder
              </CardTitle>
              <CardDescription>
                Find colleges offering your recommended courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quizCompleted ? (
                <Button className="w-full">
                  Find Colleges
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button variant="outline" disabled className="w-full">
                  <Lock className="mr-2 h-4 w-4" />
                  Complete Quiz First
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Scholarship Hub Card */}
          <Card 
            className={`hover:shadow-elegant transition-shadow ${
              quizCompleted ? 'cursor-pointer' : 'opacity-60'
            }`}
            onClick={quizCompleted ? () => navigate('/scholarships') : undefined}
          >
            <CardHeader>
              <Trophy className={`h-12 w-12 mb-2 ${quizCompleted ? 'text-primary' : 'text-muted-foreground'}`} />
              <CardTitle className={quizCompleted ? '' : 'text-muted-foreground'}>
                Scholarship Hub
              </CardTitle>
              <CardDescription>
                Discover scholarships for your chosen courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quizCompleted ? (
                <Button className="w-full">
                  Find Scholarships
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button variant="outline" disabled className="w-full">
                  <Lock className="mr-2 h-4 w-4" />
                  Complete Quiz First
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Features (Coming Soon) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="opacity-60">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-muted-foreground mb-2" />
              <CardTitle className="text-muted-foreground">Course Roadmap</CardTitle>
              <CardDescription>
                Detailed semester plans & Indian curriculum
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled className="w-full">
                <Lock className="mr-2 h-4 w-4" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <Shield className="h-12 w-12 text-muted-foreground mb-2" />
              <CardTitle className="text-muted-foreground">Government Schemes</CardTitle>
              <CardDescription>
                NSP, PM-YASASVI & other government scholarships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled className="w-full">
                <Lock className="mr-2 h-4 w-4" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <MapPin className="h-12 w-12 text-muted-foreground mb-2" />
              <CardTitle className="text-muted-foreground">Location Guide</CardTitle>
              <CardDescription>
                Best Indian cities for your chosen course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled className="w-full">
                <Lock className="mr-2 h-4 w-4" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <FileText className="h-12 w-12 text-muted-foreground mb-2" />
              <CardTitle className="text-muted-foreground">Entrance Exam Prep</CardTitle>
              <CardDescription>
                JEE, NEET, GATE & other competitive exams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled className="w-full">
                <Lock className="mr-2 h-4 w-4" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <Briefcase className="h-12 w-12 text-muted-foreground mb-2" />
              <CardTitle className="text-muted-foreground">Job Portal</CardTitle>
              <CardDescription>
                Government jobs, PSUs & private placements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled className="w-full">
                <Lock className="mr-2 h-4 w-4" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <Globe className="h-12 w-12 text-muted-foreground mb-2" />
              <CardTitle className="text-muted-foreground">Study Abroad</CardTitle>
              <CardDescription>
                International opportunities for Indian students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled className="w-full">
                <Lock className="mr-2 h-4 w-4" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">2000+</div>
              <p className="text-sm text-muted-foreground">Indian Colleges</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">50+</div>
              <p className="text-sm text-muted-foreground">Government Schemes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">1000+</div>
              <p className="text-sm text-muted-foreground">Scholarships</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">28</div>
              <p className="text-sm text-muted-foreground">States Covered</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* AI Mentor Chatbot */}
      <AIMentorChatbot />
    </div>
  );
};

export default Dashboard;