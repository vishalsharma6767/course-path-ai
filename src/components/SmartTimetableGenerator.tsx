import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Clock, Plus, Trash2, Calendar, BookOpen, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface Subject {
  name: string;
  priority: number;
  examDate?: string;
}

interface ActivityItem {
  name: string;
  duration: number;
  frequency: string;
}

interface SmartTimetableGeneratorProps {
  user: User | null;
}

const SmartTimetableGenerator = ({ user }: SmartTimetableGeneratorProps) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [totalHours, setTotalHours] = useState([6]);
  const [durationType, setDurationType] = useState<'day' | 'week' | 'custom'>('day');
  const [isGenerating, setIsGenerating] = useState(false);
  const [timetables, setTimetables] = useState<any>(null);
  const [preferences, setPreferences] = useState({
    breakDuration: 15,
    studySessionLength: 90,
    startTime: '09:00',
    endTime: '17:00'
  });

  const { toast } = useToast();

  const addSubject = () => {
    setSubjects([...subjects, { name: '', priority: 3 }]);
  };

  const updateSubject = (index: number, field: keyof Subject, value: any) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    setSubjects(updated);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const addActivity = () => {
    setActivities([...activities, { name: '', duration: 60, frequency: 'daily' }]);
  };

  const updateActivity = (index: number, field: keyof ActivityItem, value: any) => {
    const updated = [...activities];
    updated[index] = { ...updated[index], [field]: value };
    setActivities(updated);
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const generateTimetable = async (type: 'academic_only' | 'balanced') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate timetables",
        variant: "destructive",
      });
      return;
    }

    if (subjects.length === 0) {
      toast({
        title: "Add Subjects",
        description: "Please add at least one subject to create a timetable",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('smart-timetable', {
        body: {
          subjects: subjects.filter(s => s.name.trim()),
          activities: type === 'balanced' ? activities.filter(a => a.name.trim()) : [],
          totalHours: totalHours[0],
          durationType,
          type,
          preferences,
          userId: user.id
        },
      });

      if (error) throw error;

      setTimetables(prev => ({
        ...prev,
        [type]: data.timetable
      }));

      toast({
        title: "Timetable Generated!",
        description: data.message,
      });

    } catch (error) {
      console.error('Error generating timetable:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate timetable. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderSchedule = (schedule: Record<string, any>) => {
    return (
      <div className="space-y-3">
        {Object.entries(schedule).map(([time, task]) => (
          <div key={time} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 min-w-[80px]">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-sm">{time}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                {task.type === 'study' && <BookOpen className="h-4 w-4 text-blue-500" />}
                {task.type === 'activity' && <Activity className="h-4 w-4 text-green-500" />}
                {task.type === 'break' && <Clock className="h-4 w-4 text-orange-500" />}
                <span className="font-medium">{task.title}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {task.duration} min
                </Badge>
                {task.priority && (
                  <Badge variant="secondary" className="text-xs">
                    Priority: {task.priority}
                  </Badge>
                )}
                {task.examDate && (
                  <Badge variant="destructive" className="text-xs">
                    Exam: {new Date(task.examDate).toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Smart Timetable Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subjects */}
          <div>
            <Label className="text-base font-medium">Subjects & Priorities</Label>
            <div className="space-y-3 mt-2">
              {subjects.map((subject, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Input
                    placeholder="Subject name"
                    value={subject.name}
                    onChange={(e) => updateSubject(index, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm">Priority:</Label>
                    <Slider
                      value={[subject.priority]}
                      onValueChange={([value]) => updateSubject(index, 'priority', value)}
                      max={5}
                      min={1}
                      step={1}
                      className="w-20"
                    />
                    <span className="text-sm font-medium w-4">{subject.priority}</span>
                  </div>
                  <Input
                    type="date"
                    placeholder="Exam date (optional)"
                    value={subject.examDate || ''}
                    onChange={(e) => updateSubject(index, 'examDate', e.target.value)}
                    className="w-40"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeSubject(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addSubject} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </div>
          </div>

          {/* Activities */}
          <div>
            <Label className="text-base font-medium">Non-Academic Activities (Optional)</Label>
            <div className="space-y-3 mt-2">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Input
                    placeholder="Activity name (e.g., Football, Music)"
                    value={activity.name}
                    onChange={(e) => updateActivity(index, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={activity.duration}
                    onChange={(e) => updateActivity(index, 'duration', parseInt(e.target.value) || 0)}
                    className="w-32"
                  />
                  <Select
                    value={activity.frequency}
                    onValueChange={(value) => updateActivity(index, 'frequency', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeActivity(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addActivity} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </div>
          </div>

          {/* Time Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Total Available Hours</Label>
              <div className="mt-2 space-y-2">
                <Slider
                  value={totalHours}
                  onValueChange={setTotalHours}
                  max={16}
                  min={1}
                  step={1}
                />
                <div className="text-center text-sm text-muted-foreground">
                  {totalHours[0]} hours
                </div>
              </div>
            </div>

            <div>
              <Label>Duration Type</Label>
              <Select value={durationType} onValueChange={(value: any) => setDurationType(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily Plan</SelectItem>
                  <SelectItem value="week">Weekly Plan</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={() => generateTimetable('academic_only')}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? 'Generating...' : 'Academic Only Plan'}
            </Button>
            <Button
              onClick={() => generateTimetable('balanced')}
              disabled={isGenerating}
              variant="secondary"
              className="flex-1"
            >
              {isGenerating ? 'Generating...' : 'Balanced Plan'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Timetables */}
      {timetables && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Timetables</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={timetables.academic_only ? 'academic' : 'balanced'}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="academic" disabled={!timetables.academic_only}>
                  Academic Only
                </TabsTrigger>
                <TabsTrigger value="balanced" disabled={!timetables.balanced}>
                  Balanced Plan
                </TabsTrigger>
              </TabsList>

              {timetables.academic_only && (
                <TabsContent value="academic" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Academic Focus Plan</h3>
                    <Badge>{timetables.academic_only.totalHours} hours total</Badge>
                  </div>
                  {renderSchedule(timetables.academic_only.schedule)}
                </TabsContent>
              )}

              {timetables.balanced && (
                <TabsContent value="balanced" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Balanced Plan</h3>
                    <Badge>{timetables.balanced.totalHours} hours total</Badge>
                  </div>
                  {renderSchedule(timetables.balanced.schedule)}
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartTimetableGenerator;