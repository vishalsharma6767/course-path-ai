import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Heart, BookOpen, Music, Palette, Trophy, Camera, Clock, Target } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

const PassionStudies = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  const passionPrograms = [
    {
      id: 1,
      title: "Engineering + Music Production",
      category: "music",
      icon: Music,
      timeCommitment: "15-20 hours/week",
      academicImpact: "Positive",
      careerBoost: "High",
      description: "Balance technical studies with music creation and production skills",
      benefits: [
        "Develops creativity and technical skills",
        "Builds discipline and time management",
        "Creates portfolio for dual career paths",
        "Networking in both industries"
      ],
      schedule: {
        weekdays: "2-3 hours after classes",
        weekends: "6-8 hours practice/projects"
      },
      resources: [
        "Online music production courses",
        "Home studio setup guide",
        "Local music communities",
        "Industry mentorship programs"
      ],
      successStories: [
        "Rahul (IIT-B + Bollywood composer)",
        "Priya (Software engineer + indie artist)"
      ]
    },
    {
      id: 2,
      title: "Medical Studies + Sports Excellence",
      category: "sports",
      icon: Trophy,
      timeCommitment: "12-15 hours/week",
      academicImpact: "Neutral",
      careerBoost: "Medium",
      description: "Maintain athletic performance while pursuing medical education",
      benefits: [
        "Physical fitness enhances mental performance",
        "Sports teaches teamwork and leadership",
        "Scholarship opportunities",
        "Stress relief from academic pressure"
      ],
      schedule: {
        weekdays: "Early morning training (6-8 AM)",
        weekends: "Competitions and intensive training"
      },
      resources: [
        "Sports nutrition guidance",
        "Time management apps",
        "Student-athlete support groups",
        "Medical college sports teams"
      ],
      successStories: [
        "Dr. Anjali (Olympic archer + orthopedic surgeon)",
        "Dr. Karan (Cricket player + cardiologist)"
      ]
    },
    {
      id: 3,
      title: "Business Studies + Photography",
      category: "arts",
      icon: Camera,
      timeCommitment: "10-12 hours/week",
      academicImpact: "Positive",
      careerBoost: "High",
      description: "Combine business acumen with visual storytelling skills",
      benefits: [
        "Develops visual communication skills",
        "Builds personal brand and portfolio",
        "Client management experience",
        "Additional income source during studies"
      ],
      schedule: {
        weekdays: "1-2 hours editing/planning",
        weekends: "Shoots and client meetings"
      },
      resources: [
        "Photography equipment rental",
        "Online editing tutorials",
        "Photography communities",
        "Business networking events"
      ],
      successStories: [
        "Arjun (MBA + wedding photography business)",
        "Sneha (Marketing + fashion photographer)"
      ]
    },
    {
      id: 4,
      title: "Computer Science + Digital Art",
      category: "arts",
      icon: Palette,
      timeCommitment: "8-12 hours/week",
      academicImpact: "Very Positive",
      careerBoost: "Very High",
      description: "Merge programming skills with creative digital design",
      benefits: [
        "Enhanced UI/UX design capabilities",
        "Game development opportunities",
        "Animation and VFX skills",
        "Freelancing opportunities"
      ],
      schedule: {
        weekdays: "2 hours creative practice",
        weekends: "Project completion and portfolio building"
      },
      resources: [
        "Digital art software training",
        "Online design communities",
        "Art challenges and competitions",
        "Industry workshops"
      ],
      successStories: [
        "Vikram (Game developer + concept artist)",
        "Meera (Software engineer + UI designer)"
      ]
    }
  ];

  const tips = [
    {
      title: "Time Management",
      description: "Use time blocking to dedicate specific hours to studies and passion projects",
      priority: "High"
    },
    {
      title: "Skill Integration",
      description: "Find ways to connect your passion with your academic field",
      priority: "Medium"
    },
    {
      title: "Portfolio Building",
      description: "Document both academic and passion achievements for future opportunities",
      priority: "High"
    },
    {
      title: "Stress Balance",
      description: "Use passion activities as healthy stress relief from academic pressure",
      priority: "Medium"
    }
  ];

  const filteredPrograms = passionPrograms.filter(program => 
    selectedCategory === 'all' || program.category === selectedCategory
  );

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
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Passion + Studies Support</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Balance Passion with Studies</h2>
          <p className="text-muted-foreground text-lg">
            Pursue your hobbies, sports, and arts while excelling in academics
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Programs</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
            <TabsTrigger value="arts">Arts</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Success Tips */}
        <Card className="mb-8 gradient-hero text-white">
          <CardHeader>
            <CardTitle className="text-white">Quick Success Tips</CardTitle>
            <CardDescription className="text-white/80">
              Essential strategies for balancing passion and academics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div key={index} className="bg-white/10 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{tip.title}</h4>
                    <Badge variant="secondary" className={tip.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                      {tip.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-white/80">{tip.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Passion Programs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredPrograms.map((program) => {
            const IconComponent = program.icon;
            return (
              <Card key={program.id} className="hover:shadow-elegant transition-shadow">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{program.title}</CardTitle>
                      <CardDescription>{program.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Time/Week</p>
                      <p className="font-medium text-sm">{program.timeCommitment}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Academic Impact</p>
                      <Badge variant="outline" className={
                        program.academicImpact === 'Very Positive' ? 'text-green-700 border-green-200' :
                        program.academicImpact === 'Positive' ? 'text-green-600 border-green-200' :
                        'text-blue-600 border-blue-200'
                      }>
                        {program.academicImpact}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Career Boost</p>
                      <Badge variant="outline" className={
                        program.careerBoost === 'Very High' ? 'text-purple-700 border-purple-200' :
                        program.careerBoost === 'High' ? 'text-purple-600 border-purple-200' :
                        'text-blue-600 border-blue-200'
                      }>
                        {program.careerBoost}
                      </Badge>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Suggested Schedule
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Weekdays:</span>
                        <span className="text-sm">{program.schedule.weekdays}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Weekends:</span>
                        <span className="text-sm">{program.schedule.weekends}</span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Key Benefits
                    </h4>
                    <ul className="space-y-1">
                      {program.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Success Stories */}
                  <div>
                    <h4 className="font-semibold mb-2">Success Stories</h4>
                    <div className="space-y-1">
                      {program.successStories.map((story, index) => (
                        <Badge key={index} variant="secondary" className="mr-1 mb-1 text-xs">
                          {story}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button size="sm" className="flex-1">Get Started</Button>
                    <Button variant="outline" size="sm">Resources</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <Card className="text-center">
          <CardContent className="py-8">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Start Your Balanced Journey</h3>
            <p className="text-muted-foreground mb-4">
              Get personalized guidance on combining your passion with academic excellence
            </p>
            <div className="flex gap-2 justify-center">
              <Button>Book Consultation</Button>
              <Button variant="outline">Join Community</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PassionStudies;