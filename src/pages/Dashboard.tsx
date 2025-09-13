import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, Building, Award, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h2>
          <p className="text-muted-foreground text-lg">
            Let's discover your perfect course and plan your academic future!
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-elegant transition-shadow cursor-pointer" onClick={() => navigate('/quiz')}>
            <CardHeader>
              <GraduationCap className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Take AI Quiz</CardTitle>
              <CardDescription>
                Start your personalized learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Begin Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-shadow cursor-pointer" onClick={() => navigate('/colleges')}>
            <CardHeader>
              <Building className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Find Colleges</CardTitle>
              <CardDescription>
                Discover colleges and scholarship opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Explore Options
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-shadow cursor-pointer" onClick={() => navigate('/smart-timetable')}>
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Smart Timetable</CardTitle>
              <CardDescription>
                AI-powered study schedule generator
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Create Schedule
                <ArrowRight className="ml-2 h-4 w-4" />
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
    </DashboardLayout>
  );
};

export default Dashboard;