import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  TrendingUp, 
  Bell, 
  BookOpen, 
  Calendar, 
  Trophy, 
  Target, 
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  BarChart3
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

const SmartDashboard = () => {
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

  const todayReminders = [
    {
      id: 1,
      title: "NEET Mock Test",
      time: "10:00 AM",
      type: "exam",
      priority: "high",
      completed: false
    },
    {
      id: 2,
      title: "Career Counseling Session",
      time: "3:00 PM",
      type: "meeting",
      priority: "medium",
      completed: false
    },
    {
      id: 3,
      title: "Physics Assignment Due",
      time: "11:59 PM",
      type: "assignment",
      priority: "high",
      completed: true
    }
  ];

  const weeklyGoals = [
    {
      goal: "Complete 5 Mock Tests",
      progress: 3,
      total: 5,
      category: "Exam Prep"
    },
    {
      goal: "Study 25 hours",
      progress: 18,
      total: 25,
      category: "Study Time"
    },
    {
      goal: "Attend 2 Webinars",
      progress: 1,
      total: 2,
      category: "Learning"
    },
    {
      goal: "Complete Course Research",
      progress: 2,
      total: 3,
      category: "Career Planning"
    }
  ];

  const recentAchievements = [
    {
      title: "Quiz Master",
      description: "Completed career aptitude quiz",
      date: "2024-01-12",
      icon: Trophy,
      color: "text-yellow-600"
    },
    {
      title: "Early Bird",
      description: "Attended morning webinar",
      date: "2024-01-10",
      icon: Star,
      color: "text-blue-600"
    },
    {
      title: "Consistent Learner",
      description: "7-day study streak",
      date: "2024-01-08",
      icon: Target,
      color: "text-green-600"
    }
  ];

  const studyStats = {
    totalHours: 45,
    weeklyHours: 12,
    avgDaily: 2.5,
    streakDays: 7,
    completedTasks: 23,
    pendingTasks: 5
  };

  const recommendedResources = [
    {
      title: "JEE Advanced Previous Papers",
      type: "Practice Material",
      relevance: 95,
      timeToComplete: "3 hours"
    },
    {
      title: "Organic Chemistry Video Series",
      type: "Video Content",
      relevance: 88,
      timeToComplete: "5 hours"
    },
    {
      title: "Mock Interview for Engineering",
      type: "Interview Prep",
      relevance: 82,
      timeToComplete: "1 hour"
    }
  ];

  const upcomingDeadlines = [
    {
      task: "JEE Main Application",
      date: "2024-01-25",
      daysLeft: 10,
      priority: "critical"
    },
    {
      task: "Scholarship Application",
      date: "2024-01-30",
      daysLeft: 15,
      priority: "high"
    },
    {
      task: "College Visit Registration",
      date: "2024-02-05",
      daysLeft: 21,
      priority: "medium"
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
            <TrendingUp className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Smart Dashboard</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Your Personalized Learning Hub</h2>
          <p className="text-muted-foreground text-lg">
            Track progress, get reminders, and access curated resources
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{studyStats.totalHours}h</div>
                  <p className="text-sm text-muted-foreground">Total Study Time</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{studyStats.streakDays}</div>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{studyStats.completedTasks}</div>
                  <p className="text-sm text-muted-foreground">Tasks Done</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{studyStats.pendingTasks}</div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Reminders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>Your important tasks and appointments for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayReminders.map((reminder) => (
                    <div key={reminder.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                      reminder.completed ? 'bg-green-50 border-green-200' : 'bg-background'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          reminder.completed ? 'bg-green-100' : 
                          reminder.priority === 'high' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {reminder.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : reminder.priority === 'high' ? (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${reminder.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {reminder.title}
                          </p>
                          <p className="text-sm text-muted-foreground">{reminder.time}</p>
                        </div>
                      </div>
                      <Badge variant={
                        reminder.priority === 'high' ? 'destructive' : 
                        reminder.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {reminder.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Weekly Goals
                </CardTitle>
                <CardDescription>Track your progress towards weekly targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyGoals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{goal.goal}</p>
                          <p className="text-sm text-muted-foreground">{goal.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{goal.progress}/{goal.total}</p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round((goal.progress / goal.total) * 100)}% complete
                          </p>
                        </div>
                      </div>
                      <Progress value={(goal.progress / goal.total) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress */}
          <TabsContent value="progress" className="space-y-6">
            {/* Study Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Study Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{studyStats.weeklyHours}h</div>
                      <p className="text-sm text-muted-foreground">This Week</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{studyStats.avgDaily}h</div>
                      <p className="text-sm text-muted-foreground">Daily Average</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Weekly Target: 20h</span>
                      <span>{studyStats.weeklyHours}/20h</span>
                    </div>
                    <Progress value={(studyStats.weeklyHours / 20) * 100} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentAchievements.map((achievement, index) => {
                      const IconComponent = achievement.icon;
                      return (
                        <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                          <div className={`p-2 rounded-full bg-gray-100`}>
                            <IconComponent className={`h-4 w-4 ${achievement.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{achievement.title}</p>
                            <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{achievement.date}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Deadlines
                </CardTitle>
                <CardDescription>Important dates you need to track</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingDeadlines.map((deadline, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{deadline.task}</p>
                        <p className="text-sm text-muted-foreground">{deadline.date}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          deadline.priority === 'critical' ? 'destructive' :
                          deadline.priority === 'high' ? 'default' : 'secondary'
                        }>
                          {deadline.daysLeft} days left
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources */}
          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Recommended for You
                </CardTitle>
                <CardDescription>Personalized resources based on your goals and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedResources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex-1">
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-sm text-muted-foreground">{resource.type}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {resource.relevance}% match
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {resource.timeToComplete}
                          </span>
                        </div>
                      </div>
                      <Button size="sm">Access</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reminders */}
          <TabsContent value="reminders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Smart Reminders
                </CardTitle>
                <CardDescription>Set up personalized reminders for your goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Smart Reminders Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    We're working on intelligent reminders that adapt to your schedule and goals
                  </p>
                  <Button>Get Notified When Ready</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SmartDashboard;