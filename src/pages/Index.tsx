import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, Brain, Users, BookOpen, Trophy, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import AuthModal from '@/components/auth/AuthModal';

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Assessment",
      description: "Take our adaptive quiz to discover courses that match your interests and aptitude"
    },
    {
      icon: BookOpen,
      title: "Course Recommendations", 
      description: "Get personalized course suggestions with detailed career pathways and opportunities"
    },
    {
      icon: Users,
      title: "College Guidance",
      description: "Find the best colleges offering your recommended courses with admission details"
    },
    {
      icon: Trophy,
      title: "Scholarship Hub",
      description: "Access scholarships tailored to your course, category, and financial needs"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              Catalyst
            </h1>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" onClick={() => openAuth('login')}>
              Login
            </Button>
            <Button variant="hero" onClick={() => openAuth('signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 animate-fade-in">
              Discover Your Perfect Course with{' '}
              <span className="gradient-hero bg-clip-text text-transparent">
                AI Guidance
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in max-w-2xl mx-auto">
              Take our intelligent assessment and get personalized course recommendations 
              with complete guidance on careers, colleges, and scholarships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
              <Button variant="hero" size="lg" onClick={() => openAuth('signup')}>
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
            
            {/* Hero Image */}
            <div className="relative max-w-4xl mx-auto animate-fade-in">
              <img 
                src={heroImage} 
                alt="Students discovering their future" 
                className="rounded-lg shadow-elegant w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              Why Choose Catalyst?
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive guidance to help you make 
              informed decisions about your academic and career future.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card p-6 rounded-lg shadow-sm hover:shadow-elegant transition-all duration-300 animate-fade-in border"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Discover Your Perfect Course?
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their ideal academic path with Catalyst's AI guidance.
          </p>
          <Button variant="secondary" size="lg" onClick={() => openAuth('signup')}>
            Start Assessment Now
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-semibold">Catalyst</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 Catalyst. Empowering students to make informed educational choices.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
};

export default Index;