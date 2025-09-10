import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { FileText, Search, Calendar, Users, BookOpen, Clock, Target, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Exam {
  id: string;
  name: string;
  fullName: string;
  category: string;
  examDate: string;
  applicationDeadline: string;
  eligibility: string[];
  syllabusTopics: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  studyDuration: string;
  samplePapers: number;
  mockTests: number;
  preparationTips: string[];
  cutoffTrend: string;
  seats: string;
  successRate: number;
}

const entranceExams: Exam[] = [
  {
    id: '1',
    name: 'JEE Main',
    fullName: 'Joint Entrance Examination Main',
    category: 'Engineering',
    examDate: 'January & April 2024',
    applicationDeadline: 'December 2023 & March 2024',
    eligibility: ['12th passed with PCM', 'Minimum 75% in boards', 'Age limit: 25 years'],
    syllabusTopics: ['Physics', 'Chemistry', 'Mathematics', 'Aptitude Test (B.Arch)'],
    difficulty: 'Hard',
    studyDuration: '2 years',
    samplePapers: 15,
    mockTests: 25,
    preparationTips: [
      'Focus on NCERT concepts first',
      'Practice previous year questions',
      'Take regular mock tests',
      'Time management is crucial'
    ],
    cutoffTrend: 'Increasing by 2-3% annually',
    seats: '2.5 lakh seats',
    successRate: 12
  },
  {
    id: '2',
    name: 'NEET',
    fullName: 'National Eligibility cum Entrance Test',
    category: 'Medical',
    examDate: 'May 2024',
    applicationDeadline: 'March 2024',
    eligibility: ['12th with PCB', 'Minimum 50% (40% for SC/ST)', 'Age: 17-25 years'],
    syllabusTopics: ['Physics', 'Chemistry', 'Biology (Botany & Zoology)'],
    difficulty: 'Hard',
    studyDuration: '2 years',
    samplePapers: 20,
    mockTests: 30,
    preparationTips: [
      'Master NCERT thoroughly',
      'Focus on Biology - highest weightage',
      'Practice MCQs daily',
      'Maintain accuracy over speed'
    ],
    cutoffTrend: 'Stable with minor fluctuations',
    seats: '1.08 lakh MBBS seats',
    successRate: 8
  },
  {
    id: '3',
    name: 'GATE',
    fullName: 'Graduate Aptitude Test in Engineering',
    category: 'Engineering/PG',
    examDate: 'February 2024',
    applicationDeadline: 'October 2023',
    eligibility: ['BE/BTech completed', 'Final year students eligible', 'No age limit'],
    syllabusTopics: ['Core Engineering Subject', 'Engineering Mathematics', 'General Aptitude'],
    difficulty: 'Medium',
    studyDuration: '6-12 months',
    samplePapers: 12,
    mockTests: 20,
    preparationTips: [
      'Focus on core subjects',
      'Solve numerical problems daily',
      'Previous year analysis is key',
      'Virtual calculator practice'
    ],
    cutoffTrend: 'Branch-wise variation',
    seats: 'PSU recruitment + M.Tech admissions',
    successRate: 15
  },
  {
    id: '4',
    name: 'CAT',
    fullName: 'Common Admission Test',
    category: 'Management',
    examDate: 'November 2024',
    applicationDeadline: 'September 2024',
    eligibility: ['Graduation completed', 'Minimum 50% marks', 'No age limit'],
    syllabusTopics: ['Verbal Ability', 'Data Interpretation', 'Logical Reasoning', 'Quantitative Aptitude'],
    difficulty: 'Hard',
    studyDuration: '12-18 months',
    samplePapers: 10,
    mockTests: 40,
    preparationTips: [
      'Read newspapers daily',
      'Practice mental math',
      'Sectional time limits',
      'Mock test analysis crucial'
    ],
    cutoffTrend: 'Increasing competitiveness',
    seats: '5,000+ seats in IIMs',
    successRate: 2
  },
  {
    id: '5',
    name: 'CLAT',
    fullName: 'Common Law Admission Test',
    category: 'Law',
    examDate: 'May 2024',
    applicationDeadline: 'March 2024',
    eligibility: ['12th passed (UG)', 'LLB graduates (PG)', 'Age: Max 20 years (UG)'],
    syllabusTopics: ['English', 'Current Affairs', 'Legal Reasoning', 'Logical Reasoning', 'Quantitative Techniques'],
    difficulty: 'Medium',
    studyDuration: '12 months',
    samplePapers: 8,
    mockTests: 15,
    preparationTips: [
      'Stay updated with current affairs',
      'Read legal magazines',
      'Practice comprehension daily',
      'Time management crucial'
    ],
    cutoffTrend: 'Stable cutoffs',
    seats: '2,500+ seats in NLUs',
    successRate: 5
  },
  {
    id: '6',
    name: 'UPSC CSE',
    fullName: 'Civil Services Examination',
    category: 'Government Service',
    examDate: 'June (Prelims), October (Mains)',
    applicationDeadline: 'March 2024',
    eligibility: ['Graduation completed', 'Age: 21-32 years', 'Attempts limited by category'],
    syllabusTopics: ['General Studies', 'Optional Subject', 'Essay', 'Current Affairs'],
    difficulty: 'Hard',
    studyDuration: '12-24 months',
    samplePapers: 25,
    mockTests: 50,
    preparationTips: [
      'Read NCERT books thoroughly',
      'Current affairs is crucial',
      'Answer writing practice',
      'Choose optional wisely'
    ],
    cutoffTrend: 'Highly competitive',
    seats: '900+ vacancies annually',
    successRate: 0.2
  }
];

const EntranceExamPrep = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const filteredExams = entranceExams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || exam.category.toLowerCase() === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || exam.difficulty.toLowerCase() === difficultyFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </Button>
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Entrance Exam Prep</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Competitive Exam Preparation</h2>
          <p className="text-muted-foreground text-lg">
            Complete preparation guide for major Indian entrance examinations
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Filter Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search exams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="law">Law</SelectItem>
                    <SelectItem value="government service">Government Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredExams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{exam.name}</CardTitle>
                    <CardDescription className="text-base mb-2">{exam.fullName}</CardDescription>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{exam.category}</Badge>
                      <Badge className={getDifficultyColor(exam.difficulty)}>
                        {exam.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <p className="text-sm font-medium">Exam Date</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{exam.examDate}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <p className="text-sm font-medium">Application Deadline</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{exam.applicationDeadline}</p>
                  </div>
                </div>

                {/* Success Rate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Success Rate</p>
                    <p className="text-sm text-muted-foreground">{exam.successRate}%</p>
                  </div>
                  <Progress value={exam.successRate} className="h-2" />
                </div>

                {/* Study Resources */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <BookOpen className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-sm font-medium">{exam.samplePapers}</p>
                    <p className="text-xs text-muted-foreground">Sample Papers</p>
                  </div>
                  <div className="text-center">
                    <Target className="h-4 w-4 mx-auto mb-1 text-green-600" />
                    <p className="text-sm font-medium">{exam.mockTests}</p>
                    <p className="text-xs text-muted-foreground">Mock Tests</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                    <p className="text-sm font-medium">{exam.studyDuration}</p>
                    <p className="text-xs text-muted-foreground">Study Time</p>
                  </div>
                </div>

                {/* Syllabus Topics */}
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Syllabus Topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exam.syllabusTopics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Preparation Tips */}
                <div>
                  <p className="text-sm font-medium mb-2">Top Preparation Tips</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {exam.preparationTips.slice(0, 2).map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Additional Info */}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-medium">Available Seats</p>
                      <p className="text-muted-foreground">{exam.seats}</p>
                    </div>
                    <div>
                      <p className="font-medium">Cutoff Trend</p>
                      <p className="text-muted-foreground">{exam.cutoffTrend}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1">
                    Start Preparation
                  </Button>
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExams.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No exams found</p>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </CardContent>
          </Card>
        )}

        {/* Study Plan Template */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>General Study Plan Template</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Foundation (3 months)</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Complete NCERT/basics</li>
                  <li>• Understand concepts</li>
                  <li>• Build fundamentals</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Practice (6 months)</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Solve previous papers</li>
                  <li>• Topic-wise practice</li>
                  <li>• Build speed & accuracy</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Mock Tests (2 months)</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Daily mock tests</li>
                  <li>• Analyze performance</li>
                  <li>• Time management</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Revision (1 month)</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Quick revision</li>
                  <li>• Formula sheets</li>
                  <li>• Last-minute tips</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EntranceExamPrep;