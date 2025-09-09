import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  ArrowLeft, 
  BookOpen, 
  Briefcase, 
  Clock, 
  CheckCircle,
  Users,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

interface CourseRecommendation {
  course: string;
  confidence: number;
  reasoning: string;
  careerPaths: string[];
  prerequisites: string[];
  duration: string;
}

interface QuizResult {
  id: string;
  user_id: string;
  answers: any;
  recommended_courses: string[];
  ai_analysis: any; // Changed from specific type to any to handle Json from Supabase
  created_at: string;
}

const Results = () => {
  const [user, setUser] = useState<User | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadResults = async () => {
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/');
        return;
      }
      setUser(session.user);

      // Fetch latest quiz results
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching results:', error);
        toast({
          variant: "destructive",
          title: "Error Loading Results",
          description: "Failed to load your quiz results. Please try taking the quiz again.",
        });
        navigate('/dashboard');
        return;
      }

      if (!data || data.length === 0) {
        toast({
          variant: "destructive",
          title: "No Results Found",
          description: "Please take the quiz first to see your recommendations.",
        });
        navigate('/quiz');
        return;
      }

      setQuizResult(data[0] as QuizResult);
      setLoading(false);
    };

    loadResults();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !quizResult) return null;

  const recommendations = quizResult.ai_analysis?.recommendations || [];

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

      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-hero mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Your Course Recommendations</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Based on your quiz responses, we've identified the perfect courses that match your 
            interests, strengths, and career aspirations.
          </p>
        </div>

        {/* AI Analysis */}
        {quizResult.ai_analysis?.analysis && (
          <Card className="mb-8 gradient-primary text-white">
            <CardHeader>
              <CardTitle className="text-white">Personality Analysis</CardTitle>
              <CardDescription className="text-white/80">
                Here's what we learned about you from your responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 leading-relaxed">
                {quizResult.ai_analysis.analysis}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Course Recommendations */}
        <div className="space-y-6 mb-8">
          <h3 className="text-2xl font-semibold">Recommended Courses</h3>
          
          {recommendations.map((recommendation, index) => (
            <Card 
              key={index} 
              className="shadow-elegant hover:shadow-glow transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={index === 0 ? "default" : "secondary"} className="text-xs">
                        #{index + 1} Recommendation
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {recommendation.confidence}% Match
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{recommendation.course}</CardTitle>
                    <div className="mb-3">
                      <Progress value={recommendation.confidence} className="h-2" />
                    </div>
                  </div>
                  <BookOpen className="h-8 w-8 text-primary ml-4" />
                </div>
                <CardDescription className="text-base">
                  {recommendation.reasoning}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Duration */}
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Duration: {recommendation.duration}</span>
                </div>

                {/* Career Paths */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Career Opportunities:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.careerPaths.map((career, careerIndex) => (
                      <Badge key={careerIndex} variant="outline" className="text-xs">
                        {career}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Prerequisites */}
                {recommendation.prerequisites.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Prerequisites:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.prerequisites.map((prereq, prereqIndex) => (
                        <Badge key={prereqIndex} variant="secondary" className="text-xs">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Next Steps */}
        <Card className="gradient-secondary text-white">
          <CardHeader>
            <CardTitle className="text-white">What's Next?</CardTitle>
            <CardDescription className="text-white/80">
              Continue your journey with complete course guidance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-white/80" />
                <div>
                  <h4 className="font-semibold text-white">Find Colleges</h4>
                  <p className="text-sm text-white/70">Discover colleges offering your courses</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Trophy className="h-8 w-8 text-white/80" />
                <div>
                  <h4 className="font-semibold text-white">Get Scholarships</h4>
                  <p className="text-sm text-white/70">Find financial aid opportunities</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-white/80" />
                <div>
                  <h4 className="font-semibold text-white">Course Roadmap</h4>
                  <p className="text-sm text-white/70">Get your semester-wise plan</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => navigate('/dashboard')}
              >
                Explore More Features
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                className="text-white/80 hover:bg-white/10"
                onClick={() => navigate('/quiz')}
              >
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;