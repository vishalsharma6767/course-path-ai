import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Users, Calendar, Video, Star, Clock, MapPin, GraduationCap, Briefcase } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

const MentorshipWebinars = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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

  const mentors = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      title: "Senior Software Architect",
      company: "Google India",
      expertise: ["Software Engineering", "AI/ML", "Career Guidance"],
      experience: "15+ years",
      rating: 4.9,
      sessions: 250,
      education: "IIT Delhi, Stanford MS",
      specialization: "Helping engineering students transition to tech careers",
      availability: "Weekends",
      languages: ["English", "Hindi"],
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      title: "Cardiologist & Medical Educator",
      company: "AIIMS Delhi",
      expertise: ["Medical Career", "NEET Guidance", "Specialization"],
      experience: "12+ years",
      rating: 4.8,
      sessions: 180,
      education: "AIIMS Delhi, MD Cardiology",
      specialization: "Medical education and specialization guidance",
      availability: "Evenings",
      languages: ["English", "Hindi"],
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "CA Amit Patel",
      title: "Chartered Accountant & Finance Head",
      company: "Tata Consultancy",
      expertise: ["Finance", "CA Guidance", "Corporate Finance"],
      experience: "10+ years",
      rating: 4.7,
      sessions: 120,
      education: "CA, CFA, MBA Finance",
      specialization: "Finance careers and CA pathway guidance",
      availability: "Flexible",
      languages: ["English", "Hindi", "Gujarati"],
      image: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Prof. Sneha Reddy",
      title: "Assistant Professor & Research Scientist",
      company: "IISc Bangalore",
      expertise: ["Research", "PhD Guidance", "Academia"],
      experience: "8+ years",
      rating: 4.9,
      sessions: 95,
      education: "PhD Physics, MIT",
      specialization: "Research careers and higher education abroad",
      availability: "Weekdays",
      languages: ["English", "Telugu", "Hindi"],
      image: "/placeholder.svg"
    }
  ];

  const upcomingWebinars = [
    {
      id: 1,
      title: "Cracking Software Engineering Interviews",
      presenter: "Dr. Rajesh Kumar",
      date: "2024-01-15",
      time: "7:00 PM IST",
      duration: "90 minutes",
      attendees: 450,
      maxAttendees: 500,
      topics: ["Data Structures", "System Design", "Interview Tips", "Career Path"],
      level: "Intermediate",
      isLive: false,
      price: "Free"
    },
    {
      id: 2,
      title: "NEET Preparation Strategy for 2024",
      presenter: "Dr. Priya Sharma",
      date: "2024-01-18",
      time: "6:00 PM IST",
      duration: "120 minutes",
      attendees: 320,
      maxAttendees: 400,
      topics: ["Study Plan", "Time Management", "Mock Tests", "Stress Management"],
      level: "Beginner",
      isLive: false,
      price: "Free"
    },
    {
      id: 3,
      title: "CA Career Path: From Foundation to Success",
      presenter: "CA Amit Patel",
      date: "2024-01-20",
      time: "8:00 PM IST",
      duration: "75 minutes",
      attendees: 180,
      maxAttendees: 300,
      topics: ["CA Journey", "Articleship", "Career Options", "Industry Insights"],
      level: "Beginner",
      isLive: false,
      price: "Free"
    }
  ];

  const liveWebinar = {
    id: 'live',
    title: "Building Your Research Profile for PhD Applications",
    presenter: "Prof. Sneha Reddy",
    currentAttendees: 125,
    maxAttendees: 200,
    startedAt: "6:30 PM IST",
    topics: ["Research Experience", "Publications", "Statement of Purpose", "University Selection"],
    level: "Advanced"
  };

  const pastWebinars = [
    {
      id: 1,
      title: "Complete Guide to IIT JEE Preparation",
      presenter: "Prof. Arun Joshi",
      date: "2024-01-10",
      views: 2500,
      rating: 4.8,
      duration: "2 hours",
      recordingAvailable: true
    },
    {
      id: 2,
      title: "Startup vs Corporate: Making the Right Choice",
      presenter: "Entrepreneur Vikash Singh",
      date: "2024-01-08",
      views: 1800,
      rating: 4.6,
      duration: "90 minutes",
      recordingAvailable: true
    },
    {
      id: 3,
      title: "Study Abroad: Complete Application Guide",
      presenter: "Education Consultant Ritu Malhotra",
      date: "2024-01-05",
      views: 3200,
      rating: 4.9,
      duration: "2.5 hours",
      recordingAvailable: true
    }
  ];

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
    mentor.company.toLowerCase().includes(searchQuery.toLowerCase())
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
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Mentorship & Webinars</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Connect with Industry Experts</h2>
          <p className="text-muted-foreground text-lg">
            Get guidance from alumni, teachers, and industry professionals
          </p>
        </div>

        <Tabs defaultValue="webinars" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="webinars">Live Webinars</TabsTrigger>
            <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
            <TabsTrigger value="recordings">Past Sessions</TabsTrigger>
            <TabsTrigger value="schedule">My Schedule</TabsTrigger>
          </TabsList>

          {/* Live Webinars */}
          <TabsContent value="webinars" className="space-y-6">
            {/* Currently Live */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <Badge variant="destructive">LIVE NOW</Badge>
                    <h3 className="text-lg font-semibold">{liveWebinar.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Started at {liveWebinar.startedAt}</p>
                    <p className="text-sm font-medium">{liveWebinar.currentAttendees}/{liveWebinar.maxAttendees} attendees</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-muted-foreground mb-2">with {liveWebinar.presenter}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {liveWebinar.topics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Video className="h-4 w-4 mr-2" />
                    Join Live Session
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Webinars */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Upcoming Webinars</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingWebinars.map((webinar) => (
                  <Card key={webinar.id} className="hover:shadow-elegant transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{webinar.title}</CardTitle>
                          <CardDescription>by {webinar.presenter}</CardDescription>
                        </div>
                        <Badge variant="secondary">{webinar.level}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {webinar.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {webinar.time}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          {webinar.price}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {webinar.topics.slice(0, 3).map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {webinar.topics.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{webinar.topics.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {webinar.attendees}/{webinar.maxAttendees} registered
                        </span>
                        <Button size="sm">Register Free</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Find Mentors */}
          <TabsContent value="mentors" className="space-y-6">
            <div className="flex gap-4 mb-6">
              <Input
                placeholder="Search mentors by name, expertise, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMentors.map((mentor) => (
                <Card key={mentor.id} className="hover:shadow-elegant transition-shadow">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{mentor.name}</CardTitle>
                        <CardDescription className="text-base">{mentor.title}</CardDescription>
                        <p className="text-sm text-muted-foreground">{mentor.company}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{mentor.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{mentor.sessions} sessions</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Expertise</h4>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Experience</p>
                        <p className="font-medium">{mentor.experience}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Education</p>
                        <p className="font-medium">{mentor.education}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Specialization</p>
                      <p className="text-sm">{mentor.specialization}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm">
                        <p className="text-muted-foreground">Available: {mentor.availability}</p>
                        <p className="text-muted-foreground">Languages: {mentor.languages.join(', ')}</p>
                      </div>
                      <Button size="sm">Book Session</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Past Sessions */}
          <TabsContent value="recordings" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Past Webinar Recordings</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {pastWebinars.map((webinar) => (
                  <Card key={webinar.id} className="hover:shadow-elegant transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-base">{webinar.title}</CardTitle>
                      <CardDescription>by {webinar.presenter}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>{webinar.date}</span>
                        <Badge variant="outline">{webinar.duration}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                            <span>{webinar.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{webinar.views} views</span>
                        </div>
                        {webinar.recordingAvailable && (
                          <Badge variant="secondary" className="text-xs">Recording Available</Badge>
                        )}
                      </div>

                      <Button size="sm" className="w-full">
                        <Video className="h-4 w-4 mr-2" />
                        Watch Recording
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* My Schedule */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled webinars and mentorship sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No sessions scheduled</h3>
                  <p className="text-muted-foreground mb-4">
                    Register for webinars or book mentorship sessions to see them here
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button>Browse Webinars</Button>
                    <Button variant="outline">Find Mentors</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MentorshipWebinars;