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
import GovernmentSchemes from "./pages/GovernmentSchemes";
import LocationGuide from "./pages/LocationGuide";
import EntranceExamPrep from "./pages/EntranceExamPrep";
import JobPortal from "./pages/JobPortal";
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
          <Route path="/government-schemes" element={<GovernmentSchemes />} />
          <Route path="/location-guide" element={<LocationGuide />} />
          <Route path="/entrance-exams" element={<EntranceExamPrep />} />
          <Route path="/job-portal" element={<JobPortal />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
