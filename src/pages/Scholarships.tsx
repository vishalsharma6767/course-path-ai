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
  DollarSign,
  Calendar,
  Award,
  ExternalLink,
  Lock,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string[];
  description: string;
  applicationLink: string;
  category: string;
}

const mockScholarships: Scholarship[] = [
  {
    id: '1',
    title: 'Google Computer Science Scholarship',
    provider: 'Google Inc.',
    amount: '$10,000',
    deadline: '2024-12-15',
    eligibility: ['Computer Science students', 'Minimum 3.5 GPA', 'Underrepresented minorities'],
    description: 'Supporting the next generation of computer scientists and technologists.',
    applicationLink: 'https://google.com/scholarships',
    category: 'Technology'
  },
  {
    id: '2',
    title: 'Gates Millennium Scholars Program',
    provider: 'Bill & Melinda Gates Foundation',
    amount: 'Full Tuition',
    deadline: '2024-11-30',
    eligibility: ['Outstanding academic record', 'Leadership potential', 'Financial need'],
    description: 'Comprehensive scholarship program covering full tuition and expenses.',
    applicationLink: 'https://gates.com/scholarships',
    category: 'General'
  },
  {
    id: '3',
    title: 'NASA STEM Scholarship',
    provider: 'NASA',
    amount: '$15,000',
    deadline: '2024-10-20',
    eligibility: ['STEM majors', 'US citizens', 'Minimum 3.0 GPA'],
    description: 'Supporting students pursuing careers in science, technology, engineering, and mathematics.',
    applicationLink: 'https://nasa.gov/scholarships',
    category: 'STEM'
  },
  {
    id: '4',
    title: 'Business Leaders Scholarship',
    provider: 'Future Business Leaders Association',
    amount: '$5,000',
    deadline: '2024-09-30',
    eligibility: ['Business students', 'Leadership experience', 'Community service'],
    description: 'Recognizing future business leaders with academic excellence and community involvement.',
    applicationLink: 'https://fbla.org/scholarships',
    category: 'Business'
  }
];

const Scholarships = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [scholarships, setScholarships] = useState<Scholarship[]>(mockScholarships);
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

  const filteredScholarships = scholarships.filter(scholarship =>
    scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.eligibility.some(criteria => 
      criteria.toLowerCase().includes(searchTerm.toLowerCase())
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
              Complete the AI aptitude quiz first to unlock scholarship opportunities tailored to your recommended courses.
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
          <h2 className="text-3xl font-bold mb-2">Scholarship Opportunities</h2>
          <p className="text-muted-foreground">
            Discover financial aid opportunities for your educational journey
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search scholarships by title, provider, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-6">
          {filteredScholarships.map((scholarship) => (
            <Card key={scholarship.id} className="shadow-elegant hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-xl">{scholarship.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {scholarship.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{scholarship.provider}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">{scholarship.amount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-red-500" />
                        <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <CardDescription className="mb-3">
                      {scholarship.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Eligibility Criteria:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {scholarship.eligibility.map((criteria, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {criteria}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button variant="default" size="sm" asChild>
                    <a href={scholarship.applicationLink} target="_blank" rel="noopener noreferrer">
                      Apply Now
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No scholarships found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scholarships;