import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Target, BookOpen, Heart, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface PassionPlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PassionPlanningModal = ({ isOpen, onClose }: PassionPlanningModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [plan, setPlan] = useState<any>(null);

  const questions = [
    {
      id: 'passion_type',
      title: 'What type of passion do you want to pursue?',
      type: 'radio',
      options: [
        { value: 'music', label: 'Music (singing, instruments, production)' },
        { value: 'sports', label: 'Sports (cricket, football, athletics)' },
        { value: 'arts', label: 'Arts (painting, photography, design)' },
        { value: 'dance', label: 'Dance (classical, contemporary, hip-hop)' },
        { value: 'writing', label: 'Writing (blogging, poetry, novels)' },
        { value: 'other', label: 'Other (please specify)' }
      ]
    },
    {
      id: 'current_level',
      title: 'What is your current skill level?',
      type: 'radio',
      options: [
        { value: 'beginner', label: 'Beginner - Just starting out' },
        { value: 'intermediate', label: 'Intermediate - Some experience' },
        { value: 'advanced', label: 'Advanced - Quite skilled' },
        { value: 'expert', label: 'Expert - Professional level' }
      ]
    },
    {
      id: 'time_availability',
      title: 'How much time can you dedicate per week?',
      type: 'radio',
      options: [
        { value: '5-10', label: '5-10 hours per week' },
        { value: '10-15', label: '10-15 hours per week' },
        { value: '15-20', label: '15-20 hours per week' },
        { value: '20+', label: '20+ hours per week' }
      ]
    },
    {
      id: 'academic_level',
      title: 'What is your current academic level?',
      type: 'select',
      options: [
        { value: 'class_11', label: 'Class 11' },
        { value: 'class_12', label: 'Class 12' },
        { value: 'undergraduate', label: 'Undergraduate' },
        { value: 'postgraduate', label: 'Postgraduate' }
      ]
    },
    {
      id: 'integration_preference',
      title: 'How do you want to balance passion with studies?',
      type: 'radio',
      options: [
        { value: 'with_passion', label: 'Find courses that integrate my passion (e.g., Music Technology)' },
        { value: 'separate', label: 'Keep passion separate from academics' },
        { value: 'flexible', label: 'Open to both approaches' }
      ]
    },
    {
      id: 'goals',
      title: 'What are your long-term goals with this passion?',
      type: 'textarea',
      placeholder: 'Describe your aspirations, career goals, or personal objectives...'
    }
  ];

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const generatePlan = () => {
    const passionType = answers.passion_type;
    const currentLevel = answers.current_level;
    const timeAvailability = answers.time_availability;
    const integrationPreference = answers.integration_preference;

    const generatedPlan = {
      personalizedPlan: generatePersonalizedPlan(passionType, currentLevel, timeAvailability, integrationPreference),
      weeklySchedule: generateWeeklySchedule(timeAvailability, answers.academic_level),
      courseRecommendations: generateCourseRecommendations(passionType, integrationPreference),
      milestones: generateMilestones(passionType, currentLevel),
      tips: generatePersonalizedTips(answers)
    };

    setPlan(generatedPlan);
  };

  const generatePersonalizedPlan = (passion: string, level: string, time: string, integration: string) => {
    const plans: Record<string, any> = {
      music: {
        title: "Music Development Plan",
        description: integration === 'with_passion' 
          ? "Pursue music technology or sound engineering courses while developing musical skills"
          : "Develop music skills alongside your regular studies",
        phases: [
          { phase: "Foundation", duration: "1-3 months", focus: "Basic theory, instrument practice" },
          { phase: "Skill Building", duration: "3-6 months", focus: "Advanced techniques, recording" },
          { phase: "Portfolio", duration: "6-12 months", focus: "Original compositions, performances" }
        ]
      },
      sports: {
        title: "Athletic Development Plan",
        description: integration === 'with_passion' 
          ? "Consider sports science or physiotherapy courses while maintaining athletic performance"
          : "Balance training schedule with academic commitments",
        phases: [
          { phase: "Conditioning", duration: "1-2 months", focus: "Fitness and basic skills" },
          { phase: "Skill Development", duration: "3-6 months", focus: "Advanced techniques, tactics" },
          { phase: "Competition", duration: "6-12 months", focus: "Tournaments, team selection" }
        ]
      },
      arts: {
        title: "Artistic Development Plan",
        description: integration === 'with_passion' 
          ? "Explore fine arts, design, or digital media courses that complement your artistic interests"
          : "Develop artistic portfolio while managing academic workload",
        phases: [
          { phase: "Basics", duration: "1-2 months", focus: "Fundamentals, techniques" },
          { phase: "Style Development", duration: "3-6 months", focus: "Find your artistic voice" },
          { phase: "Exhibition", duration: "6-12 months", focus: "Showcase work, build reputation" }
        ]
      }
    };

    return plans[passion] || plans.arts;
  };

  const generateWeeklySchedule = (timeAvailability: string, academicLevel: string) => {
    const schedules: Record<string, any> = {
      '5-10': {
        weekdays: "1-2 hours daily after classes",
        weekends: "3-4 hours per day",
        tips: "Focus on consistency over duration"
      },
      '10-15': {
        weekdays: "2-3 hours daily",
        weekends: "4-5 hours per day",
        tips: "Perfect balance for skill development"
      },
      '15-20': {
        weekdays: "3-4 hours daily",
        weekends: "5-6 hours per day",
        tips: "Intensive development possible"
      },
      '20+': {
        weekdays: "4+ hours daily",
        weekends: "6+ hours per day",
        tips: "Professional-level commitment possible"
      }
    };

    return schedules[timeAvailability] || schedules['5-10'];
  };

  const generateCourseRecommendations = (passion: string, integration: string) => {
    const courses: Record<string, any> = {
      music: {
        with_passion: [
          "B.Tech in Audio Engineering",
          "Bachelor of Music Technology",
          "Sound Design Courses",
          "Music Production Diploma"
        ],
        separate: [
          "Regular degree + Evening music classes",
          "Weekend music workshops",
          "Online music production courses",
          "Local music academy enrollment"
        ]
      },
      sports: {
        with_passion: [
          "Bachelor in Sports Science",
          "Physiotherapy with sports specialization",
          "Sports Management degree",
          "Physical Education (B.P.Ed)"
        ],
        separate: [
          "Regular degree + Sports club membership",
          "Academy training programs",
          "Weekend tournaments",
          "Evening coaching sessions"
        ]
      },
      arts: {
        with_passion: [
          "Bachelor of Fine Arts",
          "Design courses (Fashion/Graphic/Interior)",
          "Digital Media and Animation",
          "Art History and Criticism"
        ],
        separate: [
          "Regular degree + Art classes",
          "Weekend workshops",
          "Online art courses",
          "Local art studio membership"
        ]
      }
    };

    return courses[passion]?.[integration] || courses.arts.separate;
  };

  const generateMilestones = (passion: string, level: string) => {
    const milestones = [
      { month: 1, goal: "Establish consistent practice routine", progress: 0 },
      { month: 3, goal: "Complete first skill assessment", progress: 0 },
      { month: 6, goal: "Participate in local event/competition", progress: 0 },
      { month: 9, goal: "Build portfolio/demo reel", progress: 0 },
      { month: 12, goal: "Achieve next skill level certification", progress: 0 }
    ];

    return milestones;
  };

  const generatePersonalizedTips = (answers: Record<string, any>) => [
    "Set specific, measurable goals for both academics and passion",
    "Use passion activities as stress relief from academic pressure",
    "Look for opportunities to integrate skills (e.g., math in music, physics in sports)",
    "Build a portfolio documenting your progress in both areas",
    "Network with professionals who've balanced similar paths"
  ];

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generatePlan();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setPlan(null);
  };

  if (plan) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Your Personalized Passion + Studies Plan</DialogTitle>
            <DialogDescription>
              Customized roadmap based on your responses
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="plan" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="plan">Plan</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
            </TabsList>

            <TabsContent value="plan" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    {plan.personalizedPlan.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{plan.personalizedPlan.description}</p>
                  <div className="space-y-3">
                    {plan.personalizedPlan.phases.map((phase: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">{phase.phase}</h4>
                          <Badge variant="outline">{phase.duration}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{phase.focus}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Weekly Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Weekdays</h4>
                        <p className="text-sm text-muted-foreground">{plan.weeklySchedule.weekdays}</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Weekends</h4>
                        <p className="text-sm text-muted-foreground">{plan.weeklySchedule.weekends}</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Pro Tip</h4>
                      <p className="text-sm text-blue-700">{plan.weeklySchedule.tips}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Course Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {plan.courseRecommendations.map((course: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                        <BookOpen className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{course}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    12-Month Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {plan.milestones.map((milestone: any, index: number) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {milestone.month}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{milestone.goal}</p>
                          <Progress value={milestone.progress} className="mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={resetQuiz}>Take Quiz Again</Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button>Save Plan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Your Personalized Plan</DialogTitle>
          <DialogDescription>
            Answer a few questions to get a customized balance plan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Question {currentStep + 1} of {questions.length}
            </span>
            <Progress value={((currentStep + 1) / questions.length) * 100} className="w-32" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{questions[currentStep].title}</CardTitle>
            </CardHeader>
            <CardContent>
              {questions[currentStep].type === 'radio' && (
                <RadioGroup
                  value={answers[questions[currentStep].id] || ''}
                  onValueChange={(value) => handleAnswer(questions[currentStep].id, value)}
                >
                  {questions[currentStep].options?.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {questions[currentStep].type === 'select' && (
                <Select
                  value={answers[questions[currentStep].id] || ''}
                  onValueChange={(value) => handleAnswer(questions[currentStep].id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    {questions[currentStep].options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {questions[currentStep].type === 'textarea' && (
                <Textarea
                  value={answers[questions[currentStep].id] || ''}
                  onChange={(e) => handleAnswer(questions[currentStep].id, e.target.value)}
                  placeholder={questions[currentStep].placeholder}
                  rows={4}
                />
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              Previous
            </Button>
            <Button 
              onClick={nextStep}
              disabled={!answers[questions[currentStep].id]}
            >
              {currentStep === questions.length - 1 ? 'Generate Plan' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PassionPlanningModal;