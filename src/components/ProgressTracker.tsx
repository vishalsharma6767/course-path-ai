import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Circle, Clock, BookOpen, Activity, Trophy, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface ProgressTrackerProps {
  user: User | null;
}

interface Task {
  id: string;
  task_id: string;
  task_title: string;
  task_type: string;
  scheduled_time: string;
  completed: boolean;
  completed_at?: string;
  notes?: string;
  timetable_id: string;
}

interface Timetable {
  id: string;
  title: string;
  type: string;
  created_at: string;
  total_hours: number;
}

const ProgressTracker = ({ user }: ProgressTrackerProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    studyHours: 0,
    streak: 0
  });

  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTimetables();
      fetchTasks();
    }
  }, [user]);

  const fetchTimetables = async () => {
    try {
      const { data, error } = await supabase
        .from('timetables')
        .select('id, title, type, created_at, total_hours')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTimetables(data || []);
      
      if (data && data.length > 0 && !selectedTimetable) {
        setSelectedTimetable(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching timetables:', error);
    }
  };

  const fetchTasks = async () => {
    if (!selectedTimetable) return;

    try {
      const { data, error } = await supabase
        .from('study_progress')
        .select('*')
        .eq('user_id', user!.id)
        .eq('timetable_id', selectedTimetable)
        .order('scheduled_time', { ascending: true });

      if (error) throw error;
      
      setTasks(data || []);
      
      // Calculate stats
      const totalTasks = data?.length || 0;
      const completedTasks = data?.filter(task => task.completed).length || 0;
      const studyTasks = data?.filter(task => task.task_type === 'study' && task.completed) || [];
      const studyHours = studyTasks.length * 1.5; // Assuming average 1.5 hours per study task
      
      setStats({
        totalTasks,
        completedTasks,
        studyHours,
        streak: calculateStreak(data || [])
      });

    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (tasks: Task[]): number => {
    // Simple streak calculation - consecutive days with completed tasks
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.scheduled_time);
        return taskDate.toDateString() === currentDate.toDateString();
      });
      
      const hasCompletedTask = dayTasks.some(task => task.completed);
      
      if (hasCompletedTask) {
        streak++;
      } else if (streak > 0) {
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('study_progress')
        .update({
          completed: !completed,
          completed_at: !completed ? new Date().toISOString() : null
        })
        .eq('id', taskId);

      if (error) throw error;

      // Update local state
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !completed, completed_at: !completed ? new Date().toISOString() : undefined }
          : task
      ));

      toast({
        title: !completed ? "Task Completed! 🎉" : "Task Unchecked",
        description: !completed ? "Great job! Keep up the momentum!" : "Task marked as incomplete",
      });

      // Refresh stats
      fetchTasks();

    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const addTaskNotes = async (taskId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('study_progress')
        .update({ notes })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, notes } : task
      ));

      toast({
        title: "Notes Saved",
        description: "Your notes have been updated successfully",
      });

    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'study': return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'activity': return <Activity className="h-4 w-4 text-green-500" />;
      case 'break': return <Clock className="h-4 w-4 text-orange-500" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const todayTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.scheduled_time);
    return taskDate.toDateString() === today.toDateString();
  });

  const upcomingTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.scheduled_time);
    return taskDate > today;
  });

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <p>Please log in to track your progress.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6 text-center">
          <p>Loading your progress...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{stats.completedTasks}/{stats.totalTasks}</div>
            <div className="text-sm text-muted-foreground">Tasks Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{Math.round(stats.studyHours)}h</div>
            <div className="text-sm text-muted-foreground">Study Hours</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{stats.streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">
              {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
            <Progress 
              value={stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Timetable Selector */}
      {timetables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Timetable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {timetables.map((timetable) => (
                <Button
                  key={timetable.id}
                  variant={selectedTimetable === timetable.id ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedTimetable(timetable.id);
                    fetchTasks();
                  }}
                  className="text-sm"
                >
                  {timetable.title}
                  <Badge variant="secondary" className="ml-2">
                    {timetable.type === 'academic_only' ? 'Academic' : 'Balanced'}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="today">
            <TabsList>
              <TabsTrigger value="today">Today ({todayTasks.length})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming ({upcomingTasks.length})</TabsTrigger>
              <TabsTrigger value="all">All Tasks ({tasks.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-3">
              {todayTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tasks scheduled for today. Create a timetable to get started!
                </p>
              ) : (
                todayTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTaskCompletion}
                    onAddNotes={addTaskNotes}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-3">
              {upcomingTasks.slice(0, 10).map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskCompletion}
                  onAddNotes={addTaskNotes}
                />
              ))}
            </TabsContent>

            <TabsContent value="all" className="space-y-3">
              {tasks.slice(0, 20).map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskCompletion}
                  onAddNotes={addTaskNotes}
                />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string, completed: boolean) => void;
  onAddNotes: (taskId: string, notes: string) => void;
}

const TaskItem = ({ task, onToggle, onAddNotes }: TaskItemProps) => {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(task.notes || '');

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'study': return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'activity': return <Activity className="h-4 w-4 text-green-500" />;
      case 'break': return <Clock className="h-4 w-4 text-orange-500" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  return (
    <div className={`p-4 border rounded-lg ${task.completed ? 'bg-green-50 border-green-200' : 'bg-background'}`}>
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggle(task.id, task.completed)}
        >
          {task.completed ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>

        <div className="flex-1">
          <div className="flex items-center space-x-2">
            {getTaskIcon(task.task_type)}
            <span className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.task_title}
            </span>
            <Badge variant="outline" className="text-xs">
              {task.task_type}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {new Date(task.scheduled_time).toLocaleString()}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowNotes(!showNotes)}
        >
          Notes
        </Button>
      </div>

      {showNotes && (
        <div className="mt-3 pt-3 border-t">
          <Textarea
            placeholder="Add your notes about this task..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mb-2"
          />
          <Button
            size="sm"
            onClick={() => {
              onAddNotes(task.id, notes);
              setShowNotes(false);
            }}
          >
            Save Notes
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;