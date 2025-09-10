import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, BookOpen, Star, MessageCircle, TrendingUp, Heart, Trophy, Clock } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

const ParentZone = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

  const guides = [
    {
      id: 1,
      title: "Understanding Your Child's Career Confusion",
      category: "guidance",
      readTime: "5 min",
      difficulty: "Easy",
      content: "Learn how to support your child through career uncertainty without adding pressure",
      keyPoints: [
        "Listen without immediately offering solutions",
        "Avoid comparing with other children",
        "Focus on their interests and strengths",
        "Provide emotional support during decision-making"
      ]
    },
    {
      id: 2,
      title: "Supporting During Competitive Exam Stress",
      category: "mental-health",
      readTime: "7 min",
      difficulty: "Medium",
      content: "Practical ways to help your child manage exam stress and anxiety",
      keyPoints: [
        "Create a stress-free home environment",
        "Recognize signs of burnout early",
        "Encourage breaks and recreational activities",
        "Know when to seek professional help"
      ]
    },
    {
      id: 3,
      title: "Financial Planning for Your Child's Education",
      category: "financial",
      readTime: "10 min",
      difficulty: "Medium",
      content: "Complete guide to education loans, scholarships, and budget planning",
      keyPoints: [
        "Start early with education savings",
        "Understand different loan options",
        "Research scholarship opportunities",
        "Plan for additional expenses"
      ]
    },
    {
      id: 4,
      title: "Modern Career Options Beyond Traditional Fields",
      category: "careers",
      readTime: "8 min",
      difficulty: "Easy",
      content: "Explore new-age careers that might be perfect for your child",
      keyPoints: [
        "Digital marketing and social media",
        "Data science and AI careers",
        "Creative fields and entrepreneurship",
        "Hybrid career combinations"
      ]
    }
  ];

  const successStories = [
    {
      id: 1,
      studentName: "Arjun Sharma",
      parentName: "Mrs. Priya Sharma",
      journey: "From confused about career to successful software engineer",
      challenge: "Arjun was torn between engineering and arts",
      solution: "Used Catalyst to discover his passion for creative coding",
      outcome: "Now works at a top tech company doing UI/UX design",
      quote: "Catalyst helped us understand that careers can combine multiple interests. Arjun didn't have to choose between creativity and technology."
    },
    {
      id: 2,
      studentName: "Kavya Patel",
      parentName: "Mr. Rajesh Patel",
      journey: "From medical pressure to finding her true calling in psychology",
      challenge: "Family expected her to become a doctor",
      solution: "Career counseling revealed her interest in mental health",
      outcome: "Pursuing clinical psychology, very happy with her choice",
      quote: "We learned that success isn't just about traditional careers. Kavya is helping people and that makes us proud."
    },
    {
      id: 3,
      studentName: "Rahul Gupta",
      parentName: "Mrs. Meera Gupta",
      journey: "From average student to successful entrepreneur",
      challenge: "Struggling with traditional academics",
      solution: "Discovered business and leadership aptitude through quiz",
      outcome: "Started his own ed-tech company at 22",
      quote: "Catalyst showed us that academic grades aren't everything. Rahul's practical skills were his real strength."
    }
  ];

  const tips = [
    {
      title: "Communication Tips",
      description: "How to have productive career conversations",
      points: [
        "Ask open-ended questions about their interests",
        "Share your own career journey and lessons learned",
        "Avoid imposing your unfulfilled dreams on them",
        "Create regular check-in conversations"
      ]
    },
    {
      title: "Support Strategies",
      description: "Practical ways to support without pressuring",
      points: [
        "Celebrate small wins and progress",
        "Help them research career options together",
        "Connect them with professionals in their fields of interest",
        "Encourage exploration through internships and workshops"
      ]
    },
    {
      title: "When to Step Back",
      description: "Knowing when to let them lead their journey",
      points: [
        "Let them make age-appropriate decisions",
        "Support their mistakes as learning opportunities",
        "Avoid micromanaging their study schedules",
        "Trust their instincts about their own interests"
      ]
    },
    {
      title: "Red Flags to Watch",
      description: "Signs that your child needs additional support",
      points: [
        "Persistent anxiety about the future",
        "Complete loss of interest in studies",
        "Social withdrawal or isolation",
        "Physical symptoms of stress"
      ]
    }
  ];

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
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Parent Zone</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Supporting Your Child's Journey</h2>
          <p className="text-muted-foreground text-lg">
            Simple guides and success stories to help you guide your child effectively
          </p>
        </div>

        <Tabs defaultValue="guides" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="guides">Parenting Guides</TabsTrigger>
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
            <TabsTrigger value="tips">Quick Tips</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          {/* Parenting Guides */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {guides.map((guide) => (
                <Card key={guide.id} className="hover:shadow-elegant transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{guide.title}</CardTitle>
                        <CardDescription>{guide.content}</CardDescription>
                      </div>
                      <div className="ml-4 text-right space-y-1">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {guide.readTime}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {guide.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Key Points:</h4>
                      <ul className="space-y-1">
                        {guide.keyPoints.slice(0, 3).map((point, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                      <Button size="sm" className="w-full mt-4">Read Full Guide</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Success Stories */}
          <TabsContent value="stories" className="space-y-6">
            {successStories.map((story) => (
              <Card key={story.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{story.studentName}</CardTitle>
                      <CardDescription className="text-base font-medium">
                        Parent: {story.parentName}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-1">{story.journey}</p>
                    </div>
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-sm text-red-600 mb-2">The Challenge</h4>
                      <p className="text-sm text-muted-foreground">{story.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-blue-600 mb-2">The Solution</h4>
                      <p className="text-sm text-muted-foreground">{story.solution}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-green-600 mb-2">The Outcome</h4>
                      <p className="text-sm text-muted-foreground">{story.outcome}</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm italic">"{story.quote}"</p>
                    <p className="text-xs text-muted-foreground mt-2">- {story.parentName}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Quick Tips */}
          <TabsContent value="tips" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tips.map((tip, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-primary" />
                      {tip.title}
                    </CardTitle>
                    <CardDescription>{tip.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tip.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="text-sm flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Community */}
          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-elegant transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle>Parent Forums</CardTitle>
                  <CardDescription>Connect with other parents facing similar challenges</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge className="mb-4">2,500+ Active Parents</Badge>
                  <Button className="w-full">Join Community</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elegant transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <CardTitle>Expert Webinars</CardTitle>
                  <CardDescription>Monthly sessions with education and career experts</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge className="mb-4">Next: Career Guidance</Badge>
                  <Button className="w-full">Register Free</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elegant transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <Star className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <CardTitle>Success Network</CardTitle>
                  <CardDescription>Learn from parents of successful students</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge className="mb-4">Verified Stories</Badge>
                  <Button className="w-full">Explore Stories</Button>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <Card className="text-center bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="py-8">
                <Users className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Join the Parent Community</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Get support, share experiences, and learn from other parents navigating their children's career journeys
                </p>
                <div className="flex gap-2 justify-center">
                  <Button size="lg">Join Free Community</Button>
                  <Button variant="outline" size="lg">Download Parent Guide</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParentZone;