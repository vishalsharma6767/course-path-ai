import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MapPin, Calendar, Users, TrendingUp, CheckCircle, Clock, Target } from 'lucide-react';
import DetailedRoadmapModal from '@/components/DetailedRoadmapModal';
import type { User } from '@supabase/supabase-js';

const CareerRoadmaps = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const roadmaps = [
    {
      id: 1,
      title: "Software Engineer",
      category: "Technology",
      duration: "4-6 years",
      difficulty: "Medium",
      salary: "₹6-25 LPA",
      steps: [
        { phase: "Foundation", duration: "1-2 years", description: "Learn programming basics, data structures", completed: true },
        { phase: "Specialization", duration: "1-2 years", description: "Choose tech stack, build projects", completed: false },
        { phase: "Experience", duration: "2-3 years", description: "Internships, junior roles, portfolio", completed: false },
        { phase: "Growth", duration: "Ongoing", description: "Senior roles, leadership, innovation", completed: false }
      ],
      requirements: ["B.Tech/B.E in CSE", "Strong programming skills", "Problem-solving ability"],
      exams: ["JEE Main", "JEE Advanced", "BITSAT"],
      colleges: ["IIT Delhi", "IIT Bombay", "BITS Pilani"]
    },
    {
      id: 2,
      title: "Doctor (MBBS)",
      category: "Healthcare",
      duration: "5.5 years + internship",
      difficulty: "High",
      salary: "₹8-50 LPA",
      steps: [
        { phase: "Pre-Medical", duration: "2 years", description: "Class 11-12 with PCB, NEET preparation", completed: true },
        { phase: "MBBS", duration: "4.5 years", description: "Medical degree, clinical training", completed: false },
        { phase: "Internship", duration: "1 year", description: "Compulsory rotating internship", completed: false },
        { phase: "Specialization", duration: "3 years", description: "PG in chosen specialty (optional)", completed: false }
      ],
      requirements: ["12th with PCB", "NEET qualification", "Medical college admission"],
      exams: ["NEET UG", "NEET PG (for specialization)"],
      colleges: ["AIIMS Delhi", "JIPMER", "MAMC Delhi"]
    },
    {
      id: 3,
      title: "IAS Officer",
      category: "Government",
      duration: "3-5 years preparation",
      difficulty: "Very High",
      salary: "₹7.5-25 LPA + perks",
      steps: [
        { phase: "Graduation", duration: "3-4 years", description: "Any bachelor's degree", completed: true },
        { phase: "UPSC Preparation", duration: "1-3 years", description: "Prelims, Mains, Interview prep", completed: false },
        { phase: "Training", duration: "2 years", description: "LBSNAA training, probation", completed: false },
        { phase: "Service", duration: "Career", description: "District collector, secretary roles", completed: false }
      ],
      requirements: ["Bachelor's degree", "Age 21-32", "UPSC CSAT qualification"],
      exams: ["UPSC Civil Services", "State PSC (alternative)"],
      colleges: ["Any recognized university"]
    },
    {
      id: 4,
      title: "Data Scientist",
      category: "Technology",
      duration: "3-5 years",
      difficulty: "High",
      salary: "₹8-30 LPA",
      steps: [
        { phase: "Foundation", duration: "1 year", description: "Statistics, programming (Python/R)", completed: false },
        { phase: "Specialization", duration: "1-2 years", description: "Machine learning, big data tools", completed: false },
        { phase: "Experience", duration: "2-3 years", description: "Projects, internships, certifications", completed: false },
        { phase: "Expertise", duration: "Ongoing", description: "Advanced AI/ML, research, leadership", completed: false }
      ],
      requirements: ["B.Tech/M.Tech/MCA", "Strong math/stats", "Programming skills"],
      exams: ["JEE", "GATE", "University entrances"],
      colleges: ["IIT", "IIM", "ISI Kolkata"]
    },
    {
      id: 5,
      title: "Chartered Accountant",
      category: "Finance",
      duration: "4-5 years",
      difficulty: "High",
      salary: "₹6-20 LPA",
      steps: [
        { phase: "Foundation", duration: "4 months", description: "CA Foundation exam", completed: false },
        { phase: "Intermediate", duration: "8 months", description: "CA Intermediate + IT training", completed: false },
        { phase: "Articleship", duration: "3 years", description: "Practical training with CA firm", completed: false },
        { phase: "Final", duration: "6 months", description: "CA Final exam + membership", completed: false }
      ],
      requirements: ["12th pass", "CA Foundation", "Article training"],
      exams: ["CA Foundation", "CA Intermediate", "CA Final"],
      colleges: ["ICAI approved institutes"]
    }
  ];

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const matchesSearch = roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         roadmap.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || roadmap.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            <MapPin className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Career Roadmaps</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Visual Career Paths</h2>
          <p className="text-muted-foreground text-lg">
            Step-by-step guidance for jobs, competitive exams, and higher studies
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <Input
            placeholder="Search careers or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
              <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
              <TabsTrigger value="government">Government</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Roadmap Cards */}
        <div className="space-y-6">
          {filteredRoadmaps.map((roadmap) => (
            <Card key={roadmap.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{roadmap.title}</CardTitle>
                    <CardDescription>{roadmap.category}</CardDescription>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="secondary">{roadmap.difficulty}</Badge>
                    <p className="text-sm text-muted-foreground">{roadmap.duration}</p>
                    <p className="text-sm font-medium text-green-600">{roadmap.salary}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Roadmap Steps */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Career Journey
                  </h4>
                  <div className="space-y-4">
                    {roadmap.steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`p-2 rounded-full ${step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                          {step.completed ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">{step.phase}</h5>
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {step.duration}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements and Exams */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {roadmap.requirements.map((req, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Key Exams</h4>
                    <div className="space-y-1">
                      {roadmap.exams.map((exam, index) => (
                        <Badge key={index} variant="outline" className="mr-1 mb-1">
                          {exam}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Top Colleges</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {roadmap.colleges.slice(0, 3).map((college, index) => (
                        <li key={index} className="flex items-center">
                          <TrendingUp className="h-3 w-3 mr-2 text-blue-500" />
                          {college}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm" onClick={() => {
                    setSelectedRoadmap(roadmap);
                    setIsModalOpen(true);
                  }}>
                    Get Detailed Plan
                  </Button>
                  <Button variant="outline" size="sm">Find Colleges</Button>
                  <Button variant="outline" size="sm">Exam Resources</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRoadmaps.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No roadmaps found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {selectedRoadmap && (
        <DetailedRoadmapModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRoadmap(null);
          }}
          careerTitle={selectedRoadmap.title}
          category={selectedRoadmap.category}
        />
      )}
    </div>
  );
};

export default CareerRoadmaps;