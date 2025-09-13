import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TimetableRequest {
  subjects: Array<{
    name: string;
    priority: number; // 1-5 scale
    examDate?: string;
  }>;
  activities: Array<{
    name: string;
    duration: number; // minutes
    frequency: string; // daily, weekly
  }>;
  totalHours: number;
  durationType: 'day' | 'week' | 'custom';
  type: 'academic_only' | 'balanced';
  preferences: {
    breakDuration?: number;
    studySessionLength?: number;
    startTime?: string;
    endTime?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subjects, activities, totalHours, durationType, type, preferences, userId } = await req.json() as TimetableRequest & { userId: string };

    if (!subjects || !totalHours || !userId) {
      throw new Error('Missing required parameters');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const schedule = generateTimetable({
      subjects,
      activities: activities || [],
      totalHours,
      durationType,
      type,
      preferences: preferences || {}
    });

    // Save timetable to database
    const { data: timetableData, error: timetableError } = await supabase
      .from('timetables')
      .insert({
        user_id: userId,
        title: `${type === 'academic_only' ? 'Academic Focus' : 'Balanced'} Plan - ${new Date().toLocaleDateString()}`,
        type,
        subjects,
        activities: activities || [],
        duration_type: durationType,
        total_hours: totalHours,
        schedule,
        preferences
      })
      .select()
      .single();

    if (timetableError) throw timetableError;

    // Create progress tracking entries for each task
    const progressEntries = [];
    const now = new Date();
    
    for (const [timeSlot, task] of Object.entries(schedule)) {
      if (task && typeof task === 'object' && 'title' in task) {
        const taskTime = new Date(now.getTime() + Math.random() * 24 * 60 * 60 * 1000); // Random time for demo
        progressEntries.push({
          user_id: userId,
          timetable_id: timetableData.id,
          task_id: `${timeSlot}_${Date.now()}`,
          task_title: task.title,
          task_type: task.type || 'study',
          scheduled_time: taskTime.toISOString()
        });
      }
    }

    if (progressEntries.length > 0) {
      await supabase
        .from('study_progress')
        .insert(progressEntries);
    }

    return new Response(JSON.stringify({
      success: true,
      timetable: {
        id: timetableData.id,
        schedule,
        type,
        totalHours
      },
      message: type === 'academic_only' 
        ? `Created focused academic schedule with ${totalHours} hours of study time.`
        : `Created balanced schedule with ${totalHours} hours including activities and breaks.`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in smart-timetable function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateTimetable(request: TimetableRequest): Record<string, any> {
  const { subjects, activities, totalHours, type, preferences } = request;
  const schedule: Record<string, any> = {};

  const breakDuration = preferences.breakDuration || 15;
  const studySessionLength = preferences.studySessionLength || 90;
  const startTime = preferences.startTime || '09:00';
  
  // Calculate total subject priority weight
  const totalPriority = subjects.reduce((sum, subject) => sum + subject.priority, 0);
  
  let currentTime = parseTime(startTime);
  let remainingHours = totalHours * 60; // Convert to minutes
  
  if (type === 'academic_only') {
    // Academic only schedule
    subjects.forEach((subject, index) => {
      const subjectTime = Math.round((subject.priority / totalPriority) * totalHours * 60);
      
      // Break subject time into sessions
      let subjectRemaining = subjectTime;
      let sessionCount = 1;
      
      while (subjectRemaining > 0) {
        const sessionDuration = Math.min(subjectRemaining, studySessionLength);
        const timeKey = formatTime(currentTime);
        
        schedule[timeKey] = {
          title: `${subject.name} - Session ${sessionCount}`,
          duration: sessionDuration,
          type: 'study',
          priority: subject.priority,
          examDate: subject.examDate
        };
        
        currentTime += sessionDuration;
        subjectRemaining -= sessionDuration;
        sessionCount++;
        
        // Add break if not the last session and session was full length
        if (subjectRemaining > 0 && sessionDuration === studySessionLength) {
          schedule[formatTime(currentTime)] = {
            title: 'Break',
            duration: breakDuration,
            type: 'break'
          };
          currentTime += breakDuration;
        }
      }
    });
    
  } else {
    // Balanced schedule
    const studyHours = Math.round(totalHours * 0.7); // 70% study
    const activityHours = totalHours - studyHours; // 30% activities
    
    // Schedule subjects
    subjects.forEach((subject, index) => {
      const subjectTime = Math.round((subject.priority / totalPriority) * studyHours * 60);
      
      const timeKey = formatTime(currentTime);
      schedule[timeKey] = {
        title: subject.name,
        duration: subjectTime,
        type: 'study',
        priority: subject.priority,
        examDate: subject.examDate
      };
      
      currentTime += subjectTime;
      
      // Add break between subjects
      if (index < subjects.length - 1) {
        schedule[formatTime(currentTime)] = {
          title: 'Break',
          duration: breakDuration,
          type: 'break'
        };
        currentTime += breakDuration;
      }
    });
    
    // Schedule activities
    activities.forEach((activity) => {
      const timeKey = formatTime(currentTime);
      schedule[timeKey] = {
        title: activity.name,
        duration: activity.duration,
        type: 'activity',
        frequency: activity.frequency
      };
      
      currentTime += activity.duration;
    });
  }

  return schedule;
}

function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}