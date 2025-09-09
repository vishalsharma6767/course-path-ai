import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, BookOpen, Users, Trophy, Brain, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
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

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-elegant transition-shadow cursor-pointer" onClick={startQuiz}>
            <CardHeader>
              <Brain className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Start AI Quiz</CardTitle>
              <CardDescription>
                Take our intelligent assessment to get personalized course recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="quiz" className="w-full">
                Begin Assessment
              </Button>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-muted-foreground mb-2" />
              <CardTitle className="text-muted-foreground">Course Recommendations</CardTitle>
              <CardDescription>
                View your personalized course suggestions (complete quiz first)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled className="w-full">
                Locked
              </Button>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <Users className="h-12 w-12 text-muted-foreground mb-2" />
              <CardTitle className="text-muted-foreground">College Finder</CardTitle>
              <CardDescription>
                Find colleges offering your recommended courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled className="w-full">
                Locked
              </Button>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <Trophy className="h-12 w-12 text-muted-foreground mb-2" />
              <CardTitle className="text-muted-foreground">Scholarship Hub</CardTitle>
              <CardDescription>
                Discover scholarships for your chosen courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled className="w-full">
                Locked
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">500+</div>
              <p className="text-sm text-muted-foreground">Courses Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">1000+</div>
              <p className="text-sm text-muted-foreground">Partner Colleges</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">200+</div>
              <p className="text-sm text-muted-foreground">Scholarships</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">95%</div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;