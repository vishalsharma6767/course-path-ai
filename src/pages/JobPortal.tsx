import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, Search, MapPin, Calendar, DollarSign, Building, ExternalLink, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  organization: string;
  type: 'Government' | 'PSU' | 'Private';
  location: string;
  salary: string;
  experience: string;
  education: string[];
  applicationDeadline: string;
  description: string;
  skills: string[];
  benefits: string[];
  vacancies: string;
  examRequired: boolean;
  examName?: string;
  applyLink: string;
  status: 'Active' | 'Upcoming' | 'Closed';
}

const jobOpenings: Job[] = [
  {
    id: '1',
    title: 'Assistant Engineer (Civil)',
    organization: 'Indian Railways',
    type: 'Government',
    location: 'Pan India',
    salary: '₹35,400 - ₹1,12,400',
    experience: 'Fresher',
    education: ['BE/BTech in Civil Engineering', 'Diploma in Civil (3 years)'],
    applicationDeadline: '15th March 2024',
    description: 'Recruitment for Assistant Engineer posts in Civil Engineering department of Indian Railways.',
    skills: ['Civil Engineering', 'Project Management', 'AutoCAD', 'Structural Design'],
    benefits: ['Medical Insurance', 'HRA', 'Travel Allowance', 'Pension'],
    vacancies: '2,500 posts',
    examRequired: true,
    examName: 'RRB JE',
    applyLink: 'https://rrbapply.gov.in',
    status: 'Active'
  },
  {
    id: '2',
    title: 'Software Developer',
    organization: 'NIC (National Informatics Centre)',
    type: 'Government',
    location: 'Delhi, Mumbai, Bangalore',
    salary: '₹47,600 - ₹1,51,500',
    experience: '0-2 years',
    education: ['BE/BTech/MCA in Computer Science', 'BSc Computer Science'],
    applicationDeadline: '30th March 2024',
    description: 'Development and maintenance of government web applications and digital services.',
    skills: ['Java', 'Python', 'React', 'Database Management', 'Web Development'],
    benefits: ['Flexible Hours', 'Medical Insurance', 'Professional Development', 'Job Security'],
    vacancies: '150 posts',
    examRequired: true,
    examName: 'NIC Written Test',
    applyLink: 'https://nic.in/careers',
    status: 'Active'
  },
  {
    id: '3',
    title: 'Management Trainee',
    organization: 'ONGC',
    type: 'PSU',
    location: 'Dehradun, Mumbai, Chennai',
    salary: '₹40,000 - ₹1,40,000',
    experience: 'Fresher',
    education: ['MBA from recognized university', 'Engineering + MBA preferred'],
    applicationDeadline: '25th February 2024',
    description: 'Management trainee program in India\'s largest oil and gas company.',
    skills: ['Business Analysis', 'Project Management', 'Leadership', 'Strategic Planning'],
    benefits: ['Housing', 'Medical', 'LTC', 'Performance Bonus'],
    vacancies: '50 posts',
    examRequired: true,
    examName: 'ONGC GT',
    applyLink: 'https://ongcindia.com/careers',
    status: 'Closed'
  },
  {
    id: '4',
    title: 'Junior Research Fellow',
    organization: 'CSIR Labs',
    type: 'Government',
    location: 'Various CSIR Labs',
    salary: '₹31,000 + HRA',
    experience: 'Fresher',
    education: ['MSc in Science subjects', 'NET qualified preferred'],
    applicationDeadline: '10th April 2024',
    description: 'Research positions in various CSIR laboratories across India.',
    skills: ['Research Methodology', 'Data Analysis', 'Scientific Writing', 'Laboratory Skills'],
    benefits: ['Research Environment', 'Publication Opportunities', 'Conference Funding'],
    vacancies: '200+ posts',
    examRequired: true,
    examName: 'CSIR-NET',
    applyLink: 'https://csirhrdg.res.in',
    status: 'Active'
  },
  {
    id: '5',
    title: 'Data Scientist',
    organization: 'Tata Consultancy Services',
    type: 'Private',
    location: 'Bangalore, Hyderabad, Pune',
    salary: '₹8-15 LPA',
    experience: '1-3 years',
    education: ['BTech/MTech', 'Advanced degree in Data Science/Statistics'],
    applicationDeadline: 'Rolling Basis',
    description: 'Data science roles in AI/ML projects for global clients.',
    skills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'Deep Learning'],
    benefits: ['Stock Options', 'Flexible Work', 'Training Programs', 'Global Exposure'],
    vacancies: '500+ openings',
    examRequired: false,
    applyLink: 'https://tcs.com/careers',
    status: 'Active'
  },
  {
    id: '6',
    title: 'Banking Associate',
    organization: 'State Bank of India',
    type: 'PSU',
    location: 'Pan India',
    salary: '₹23,700 - ₹42,020',
    experience: 'Fresher',
    education: ['Graduation in any discipline', 'Computer knowledge required'],
    applicationDeadline: '20th March 2024',
    description: 'Clerk positions in India\'s largest public sector bank.',
    skills: ['Banking Operations', 'Customer Service', 'Computer Skills', 'Cash Handling'],
    benefits: ['Job Security', 'Medical Insurance', 'Pension', 'Loan Facilities'],
    vacancies: '5,000 posts',
    examRequired: true,
    examName: 'SBI Clerk',
    applyLink: 'https://sbi.co.in/careers',
    status: 'Upcoming'
  }
];

const JobPortal = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || job.type.toLowerCase() === typeFilter;
    const matchesLocation = locationFilter === 'all' || 
                           job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesType && matchesLocation && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Government': return 'bg-blue-100 text-blue-800';
      case 'PSU': return 'bg-green-100 text-green-800';
      case 'Private': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Closed': return 'bg-red-100 text-red-800';
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
            <Briefcase className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Job Portal</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Government Jobs & Career Opportunities</h2>
          <p className="text-muted-foreground text-lg">
            Discover government jobs, PSU positions, and private sector opportunities
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Filter Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="psu">PSU</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                    <SelectItem value="pan india">Pan India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                    <CardDescription className="text-base mb-2">{job.organization}</CardDescription>
                    <div className="flex items-center space-x-2">
                      <Badge className={getTypeColor(job.type)}>{job.type}</Badge>
                      <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">{job.description}</p>
                
                {/* Job Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Salary</p>
                      <p className="text-sm text-muted-foreground">{job.salary}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">Deadline</p>
                      <p className="text-sm text-muted-foreground">{job.applicationDeadline}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Vacancies</p>
                      <p className="text-sm text-muted-foreground">{job.vacancies}</p>
                    </div>
                  </div>
                </div>

                {/* Education Requirements */}
                <div>
                  <p className="text-sm font-medium mb-2">Education Required</p>
                  <div className="flex flex-wrap gap-2">
                    {job.education.map((edu, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {edu}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <p className="text-sm font-medium mb-2">Key Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{job.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Exam Info */}
                {job.examRequired && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm font-medium">Exam Required</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{job.examName}</p>
                  </div>
                )}

                {/* Benefits */}
                <div>
                  <p className="text-sm font-medium mb-2">Benefits</p>
                  <div className="text-sm text-muted-foreground">
                    {job.benefits.slice(0, 3).join(' • ')}
                    {job.benefits.length > 3 && ' • ...'}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Experience: {job.experience}
                  </div>
                  <Button
                    onClick={() => window.open(job.applyLink, '_blank')}
                    disabled={job.status === 'Closed'}
                    className="flex items-center space-x-2"
                  >
                    <span>{job.status === 'Closed' ? 'Closed' : 'Apply Now'}</span>
                    {job.status !== 'Closed' && <ExternalLink className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No jobs found</p>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </CardContent>
          </Card>
        )}

        {/* Career Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>Job Application Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Government Jobs</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Apply through official websites only</li>
                  <li>• Keep documents ready: Aadhaar, PAN, certificates</li>
                  <li>• Check age limits and relaxations</li>
                  <li>• Prepare for written examinations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Private Jobs</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Update your resume and LinkedIn profile</li>
                  <li>• Build relevant technical skills</li>
                  <li>• Prepare for technical interviews</li>
                  <li>• Research company culture and values</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobPortal;