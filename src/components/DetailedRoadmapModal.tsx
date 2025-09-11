import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calendar, Target, BookOpen, Award, Users, TrendingUp, AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';

interface DetailedRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerTitle: string;
  category: string;
}

const DetailedRoadmapModal = ({ isOpen, onClose, careerTitle, category }: DetailedRoadmapModalProps) => {
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRoadmap = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-detailed-roadmap', {
        body: {
          careerTitle,
          category,
          userProfile: {
            // Add any user profile data if needed
          }
        }
      });

      if (error) throw error;
      
      setRoadmapData(data.roadmap);
    } catch (err) {
      console.error('Error generating roadmap:', err);
      setError('Failed to generate detailed roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    if (!roadmapData && !loading) {
      generateRoadmap();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" onOpenAutoFocus={handleOpen}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Detailed Career Roadmap</DialogTitle>
          <DialogDescription>
            Comprehensive guide for {careerTitle} in {category}
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Generating your personalized roadmap...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={generateRoadmap}>Try Again</Button>
          </div>
        )}

        {roadmapData && (
          <div className="space-y-6">
            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="career">Career</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      24-Month Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {roadmapData.timeline && Object.entries(roadmapData.timeline).map(([period, description], index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{period}</h4>
                            <p className="text-muted-foreground">{String(description)}</p>
                            <Progress value={(index + 1) * 16.67} className="mt-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2" />
                        Essential Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {roadmapData.skills?.map((skill: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Badge variant="secondary">{skill}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {roadmapData.certifications?.map((cert: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Learning Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {roadmapData.resources?.map((resource: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2">
                            <BookOpen className="h-4 w-4 text-blue-500 mt-1" />
                            <span className="text-sm">{resource}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Networking Strategies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {roadmapData.networking?.map((strategy: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2">
                            <Users className="h-4 w-4 text-green-500 mt-1" />
                            <span className="text-sm">{strategy}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="career" className="space-y-4">
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Salary Progression
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {roadmapData.salary_progression && Object.entries(roadmapData.salary_progression).map(([level, salary]) => (
                          <div key={level} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                            <span className="font-medium">{level}</span>
                            <Badge variant="outline" className="text-green-600">{String(salary)}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          Common Challenges
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {roadmapData.challenges?.map((challenge: string, index: number) => (
                            <div key={index} className="flex items-start space-x-2">
                              <AlertTriangle className="h-4 w-4 text-orange-500 mt-1" />
                              <span className="text-sm">{challenge}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Lightbulb className="h-5 w-5 mr-2" />
                          Pro Tips
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {roadmapData.tips?.map((tip: string, index: number) => (
                            <div key={index} className="flex items-start space-x-2">
                              <Lightbulb className="h-4 w-4 text-yellow-500 mt-1" />
                              <span className="text-sm">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button>Save Roadmap</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetailedRoadmapModal;