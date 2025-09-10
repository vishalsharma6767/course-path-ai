import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Search, ExternalLink, Calendar, Users, DollarSign, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Scheme {
  id: string;
  name: string;
  provider: string;
  category: string;
  amount: string;
  eligibility: string[];
  deadline: string;
  description: string;
  link: string;
  status: 'Active' | 'Upcoming' | 'Closed';
}

const governmentSchemes: Scheme[] = [
  {
    id: '1',
    name: 'National Scholarship Portal (NSP)',
    provider: 'Ministry of Education',
    category: 'General',
    amount: '₹10,000 - ₹2,00,000',
    eligibility: ['SC/ST/OBC students', 'Family income < ₹2.5 lakh', 'Minimum 50% marks'],
    deadline: '31st March 2024',
    description: 'Comprehensive scholarship scheme for students from reserved categories pursuing higher education.',
    link: 'https://scholarships.gov.in',
    status: 'Active'
  },
  {
    id: '2',
    name: 'PM-YASASVI Scheme',
    provider: 'Ministry of Social Justice',
    category: 'OBC/EBC/DNT',
    amount: '₹1,25,000 per year',
    eligibility: ['OBC/EBC/DNT students', 'Class 9-12 students', 'Merit-based selection'],
    deadline: '15th April 2024',
    description: 'Scholarship for OBC, EBC, and DNT students in classes 9-12.',
    link: 'https://yet.nta.ac.in',
    status: 'Active'
  },
  {
    id: '3',
    name: 'Central Sector Scholarship',
    provider: 'Department of Higher Education',
    category: 'Merit-based',
    amount: '₹20,000 per year',
    eligibility: ['Top 20,000 in Class 12', 'All categories', 'Pursuing graduation'],
    deadline: '30th June 2024',
    description: 'Merit-based scholarship for top performers in Class 12 board examinations.',
    link: 'https://scholarships.gov.in',
    status: 'Active'
  },
  {
    id: '4',
    name: 'INSPIRE Scholarship',
    provider: 'DST, Government of India',
    category: 'Science',
    amount: '₹80,000 per year',
    eligibility: ['Top 1% in Class 12', 'Pursuing BSc/MSc in natural sciences', 'Age < 27 years'],
    deadline: '31st July 2024',
    description: 'Scholarship to attract talent to study natural sciences at undergraduate and postgraduate levels.',
    link: 'https://online-inspire.gov.in',
    status: 'Active'
  },
  {
    id: '5',
    name: 'Kishore Vaigyanik Protsahan Yojana (KVPY)',
    provider: 'Indian Institute of Science',
    category: 'Science Research',
    amount: '₹7,000 per month',
    eligibility: ['Class 11, 12 & UG students', 'Aptitude test', 'Interest in research'],
    deadline: '15th September 2024',
    description: 'Fellowship program to encourage students to pursue research careers in science.',
    link: 'https://kvpy.iisc.ac.in',
    status: 'Upcoming'
  },
  {
    id: '6',
    name: 'Pragati Scholarship for Girls',
    provider: 'AICTE',
    category: 'Technical Education',
    amount: '₹50,000 per year',
    eligibility: ['Female students', 'Pursuing technical degree', 'Family income < ₹8 lakh'],
    deadline: '28th February 2024',
    description: 'Scholarship to promote higher technical education among girls.',
    link: 'https://pragati.aicte-india.org',
    status: 'Closed'
  }
];

const GovernmentSchemes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredSchemes = governmentSchemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || scheme.category.toLowerCase().includes(categoryFilter);
    const matchesStatus = statusFilter === 'all' || scheme.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Government Schemes</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Government Scholarship Schemes</h2>
          <p className="text-muted-foreground text-lg">
            Discover various government scholarships and financial aid programs for Indian students
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Filter Schemes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search schemes..."
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
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="obc">OBC/EBC/DNT</SelectItem>
                    <SelectItem value="merit">Merit-based</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="technical">Technical Education</SelectItem>
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

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{scheme.name}</CardTitle>
                    <CardDescription className="text-base">{scheme.provider}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(scheme.status)}>
                    {scheme.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{scheme.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Amount</p>
                      <p className="text-sm text-muted-foreground">{scheme.amount}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Deadline</p>
                      <p className="text-sm text-muted-foreground">{scheme.deadline}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium">Eligibility</p>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    {scheme.eligibility.map((criteria, index) => (
                      <li key={index} className="list-disc">{criteria}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Badge variant="outline">{scheme.category}</Badge>
                  <Button
                    onClick={() => window.open(scheme.link, '_blank')}
                    className="flex items-center space-x-2"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No schemes found</p>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Application Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Apply early - most scholarships are processed on first-come-first-serve basis</li>
              <li>• Keep all documents ready: Aadhaar, income certificate, mark sheets, caste certificate (if applicable)</li>
              <li>• Register on National Scholarship Portal (scholarships.gov.in) for centralized applications</li>
              <li>• Check eligibility criteria carefully before applying</li>
              <li>• Follow up on your application status regularly</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GovernmentSchemes;