import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import CollegeFinder from "./pages/CollegeFinder";
import Scholarships from "./pages/Scholarships";
import CareerRoadmaps from "./pages/CareerRoadmaps";
import PassionStudies from "./pages/PassionStudies";
import StressCheck from "./pages/StressCheck";
import ParentZone from "./pages/ParentZone";
import MentorshipWebinars from "./pages/MentorshipWebinars";
import SmartDashboard from "./pages/SmartDashboard";
import SmartTimetable from "./pages/SmartTimetable";
import AIMentor from "./pages/AIMentor";
import ProgressTrackerPage from "./pages/ProgressTrackerPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/colleges" element={<CollegeFinder />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/career-roadmaps" element={<CareerRoadmaps />} />
          <Route path="/passion-studies" element={<PassionStudies />} />
          <Route path="/stress-check" element={<StressCheck />} />
          <Route path="/parent-zone" element={<ParentZone />} />
          <Route path="/mentorship" element={<MentorshipWebinars />} />
          <Route path="/smart-dashboard" element={<SmartDashboard />} />
          <Route path="/smart-timetable" element={<SmartTimetable />} />
          <Route path="/ai-mentor" element={<AIMentor />} />
          <Route path="/progress-tracker" element={<ProgressTrackerPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
