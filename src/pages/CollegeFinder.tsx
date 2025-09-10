import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  GraduationCap, 
  ArrowLeft, 
  Search,
  MapPin,
  Star,
  Users,
  BookOpen,
  ExternalLink,
  Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

interface College {
  id: string;
  name: string;
  location: string;
  rating: number;
  studentCount: string;
  coursesOffered: string[];
  fees: string;
  website: string;
  description: string;
}

const mockColleges: College[] = [
  {
    id: '1',
    name: 'MIT - Massachusetts Institute of Technology',
    location: 'Cambridge, Massachusetts',
    rating: 4.9,
    studentCount: '11,000+',
    coursesOffered: ['Computer Science', 'Engineering', 'Physics', 'Mathematics'],
    fees: '$57,000/year',
    website: 'https://mit.edu',
    description: 'Leading institute for technology and engineering research.'
  },
  {
    id: '2',
    name: 'Harvard Business School',
    location: 'Boston, Massachusetts',
    rating: 4.8,
    studentCount: '9,000+',
    coursesOffered: ['Business Administration', 'Economics', 'Management'],
    fees: '$73,000/year',
    website: 'https://hbs.edu',
    description: 'Premier business school with global recognition.'
  },
  {
    id: '3',
    name: 'Stanford University',
    location: 'Stanford, California',
    rating: 4.9,
    studentCount: '17,000+',
    coursesOffered: ['Computer Science', 'Business', 'Engineering', 'Medicine'],
    fees: '$56,000/year',
    website: 'https://stanford.edu',
    description: 'Innovation hub in Silicon Valley with top-tier programs.'
  }
];

const CollegeFinder = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [colleges, setColleges] = useState<College[]>(mockColleges);
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

      // Check if user has completed quiz
      const { data: quizData } = await supabase
        .from('quiz_results')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1);
      
      setQuizCompleted(quizData && quizData.length > 0);
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.coursesOffered.some(course => 
      course.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  if (!quizCompleted) {
    return (
      <div className="min-h-screen bg-background">
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

        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Feature Locked</h2>
            <p className="text-muted-foreground mb-6">
              Complete the AI aptitude quiz first to unlock the college finder and get personalized recommendations.
            </p>
            <Button onClick={() => navigate('/quiz')} className="w-full">
              Take Quiz Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Find Your Perfect College</h2>
          <p className="text-muted-foreground">
            Discover colleges and universities that offer your recommended courses
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search colleges, locations, or courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-6">
          {filteredColleges.map((college) => (
            <Card key={college.id} className="shadow-elegant hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{college.name}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{college.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{college.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{college.studentCount}</span>
                      </div>
                    </div>
                    <CardDescription className="mb-3">
                      {college.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Available Courses:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {college.coursesOffered.map((course, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-sm text-muted-foreground">Annual Fees: </span>
                    <span className="font-semibold">{college.fees}</span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={college.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredColleges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No colleges found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeFinder;