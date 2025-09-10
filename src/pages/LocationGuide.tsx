import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Search, Star, DollarSign, GraduationCap, Building, Wifi, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Location {
  id: string;
  city: string;
  state: string;
  rating: number;
  costOfLiving: string;
  strongFields: string[];
  topColleges: string[];
  industries: string[];
  livingCost: {
    hostel: string;
    food: string;
    transport: string;
  };
  pros: string[];
  cons: string[];
  climate: string;
  language: string[];
}

const educationHubs: Location[] = [
  {
    id: '1',
    city: 'Bangalore',
    state: 'Karnataka',
    rating: 4.8,
    costOfLiving: 'High',
    strongFields: ['Engineering', 'IT', 'Research', 'Management'],
    topColleges: ['IISc', 'IIM Bangalore', 'IIIT Bangalore', 'RV College'],
    industries: ['IT Services', 'Startups', 'R&D', 'Biotechnology'],
    livingCost: {
      hostel: '₹8,000-15,000',
      food: '₹4,000-6,000',
      transport: '₹1,500-2,500'
    },
    pros: ['IT capital of India', 'Pleasant weather', 'Great job opportunities', 'Cosmopolitan culture'],
    cons: ['High cost of living', 'Traffic congestion', 'Expensive accommodation'],
    climate: 'Pleasant year-round',
    language: ['English', 'Kannada', 'Hindi']
  },
  {
    id: '2',
    city: 'Delhi',
    state: 'Delhi',
    rating: 4.6,
    costOfLiving: 'High',
    strongFields: ['Liberal Arts', 'Management', 'Government', 'Media'],
    topColleges: ['DU', 'JNU', 'IIT Delhi', 'AIIMS Delhi'],
    industries: ['Government', 'Media', 'Consulting', 'Manufacturing'],
    livingCost: {
      hostel: '₹6,000-12,000',
      food: '₹3,500-5,500',
      transport: '₹1,000-2,000'
    },
    pros: ['Capital city advantages', 'Rich cultural heritage', 'Good metro connectivity', 'Central government jobs'],
    cons: ['Air pollution', 'Extreme weather', 'High competition'],
    climate: 'Extreme summers and winters',
    language: ['Hindi', 'English', 'Punjabi']
  },
  {
    id: '3',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 4.5,
    costOfLiving: 'Very High',
    strongFields: ['Finance', 'Media', 'Arts', 'Business'],
    topColleges: ['IIT Bombay', 'TISS', 'NMIMS', 'St. Xavier\'s'],
    industries: ['Banking & Finance', 'Entertainment', 'Textiles', 'Pharmaceuticals'],
    livingCost: {
      hostel: '₹10,000-20,000',
      food: '₹5,000-8,000',
      transport: '₹1,500-3,000'
    },
    pros: ['Financial capital', 'Entertainment industry', 'Excellent local trains', 'Diverse opportunities'],
    cons: ['Very expensive housing', 'Monsoon flooding', 'Overcrowded'],
    climate: 'Tropical with heavy monsoons',
    language: ['Hindi', 'Marathi', 'English']
  },
  {
    id: '4',
    city: 'Chennai',
    state: 'Tamil Nadu',
    rating: 4.4,
    costOfLiving: 'Moderate',
    strongFields: ['Engineering', 'Medical', 'Automobile', 'IT'],
    topColleges: ['IIT Madras', 'Anna University', 'AIIMS Chennai', 'Loyola College'],
    industries: ['Automobile', 'Healthcare', 'IT Services', 'Port & Logistics'],
    livingCost: {
      hostel: '₹5,000-10,000',
      food: '₹3,000-5,000',
      transport: '₹1,000-2,000'
    },
    pros: ['Detroit of India', 'Good healthcare facilities', 'Cultural heritage', 'Affordable living'],
    cons: ['Language barrier', 'Hot and humid', 'Water scarcity issues'],
    climate: 'Hot and humid tropical',
    language: ['Tamil', 'English', 'Telugu']
  },
  {
    id: '5',
    city: 'Pune',
    state: 'Maharashtra',
    rating: 4.7,
    costOfLiving: 'Moderate',
    strongFields: ['Engineering', 'IT', 'Automobile', 'Research'],
    topColleges: ['Pune University', 'COEP', 'Symbiosis', 'IISER Pune'],
    industries: ['IT Services', 'Automobile', 'Manufacturing', 'Education'],
    livingCost: {
      hostel: '₹6,000-12,000',
      food: '₹3,000-5,000',
      transport: '₹1,200-2,000'
    },
    pros: ['Pleasant climate', 'Student-friendly city', 'Proximity to Mumbai', 'Rich culture'],
    cons: ['Increasing traffic', 'Rising property prices', 'Water shortage'],
    climate: 'Pleasant with moderate rainfall',
    language: ['Marathi', 'Hindi', 'English']
  },
  {
    id: '6',
    city: 'Hyderabad',
    state: 'Telangana',
    rating: 4.5,
    costOfLiving: 'Moderate',
    strongFields: ['IT', 'Pharmaceuticals', 'Biotechnology', 'Aerospace'],
    topColleges: ['IIIT Hyderabad', 'ISB', 'University of Hyderabad', 'NIPER'],
    industries: ['IT Services', 'Pharmaceuticals', 'Biotechnology', 'Aerospace'],
    livingCost: {
      hostel: '₹5,000-10,000',
      food: '₹2,500-4,500',
      transport: '₹1,000-1,800'
    },
    pros: ['Cyberabad IT hub', 'Good infrastructure', 'Affordable living', 'Rich history'],
    cons: ['Hot summers', 'Limited public transport', 'Growing traffic'],
    climate: 'Hot and dry with moderate monsoons',
    language: ['Telugu', 'Hindi', 'English']
  }
];

const LocationGuide = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [fieldFilter, setFieldFilter] = useState('all');
  const [costFilter, setCostFilter] = useState('all');

  const filteredLocations = educationHubs.filter(location => {
    const matchesSearch = location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesField = fieldFilter === 'all' || location.strongFields.some(field => 
      field.toLowerCase().includes(fieldFilter.toLowerCase()));
    const matchesCost = costFilter === 'all' || location.costOfLiving.toLowerCase() === costFilter;
    
    return matchesSearch && matchesField && matchesCost;
  });

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'Very High': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Moderate': return 'bg-green-100 text-green-800';
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
            <MapPin className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Location Guide</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Best Indian Cities for Education</h2>
          <p className="text-muted-foreground text-lg">
            Find the perfect city for your studies based on your field of interest and budget
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Filter Cities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cities or states..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Field of Study</label>
                <Select value={fieldFilter} onValueChange={setFieldFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cost of Living</label>
                <Select value={costFilter} onValueChange={setCostFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cost range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ranges</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="very high">Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLocations.map((location) => (
            <Card key={location.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{location.city}</CardTitle>
                    <CardDescription className="text-base">{location.state}</CardDescription>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(location.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-muted-foreground">
                          {location.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getCostColor(location.costOfLiving)}>
                    {location.costOfLiving} Cost
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Living Costs */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <Home className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-sm font-medium">Hostel</p>
                    <p className="text-xs text-muted-foreground">{location.livingCost.hostel}</p>
                  </div>
                  <div className="text-center">
                    <DollarSign className="h-4 w-4 mx-auto mb-1 text-green-600" />
                    <p className="text-sm font-medium">Food</p>
                    <p className="text-xs text-muted-foreground">{location.livingCost.food}</p>
                  </div>
                  <div className="text-center">
                    <Wifi className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                    <p className="text-sm font-medium">Transport</p>
                    <p className="text-xs text-muted-foreground">{location.livingCost.transport}</p>
                  </div>
                </div>

                {/* Strong Fields */}
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Strong Fields
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {location.strongFields.map((field, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Top Colleges */}
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Top Colleges
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {location.topColleges.slice(0, 3).join(', ')}
                    {location.topColleges.length > 3 && '...'}
                  </p>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2 text-green-600">Pros</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {location.pros.slice(0, 2).map((pro, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-1">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2 text-red-600">Cons</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {location.cons.slice(0, 2).map((con, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-1">-</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="pt-4 border-t text-xs text-muted-foreground">
                  <p><strong>Climate:</strong> {location.climate}</p>
                  <p><strong>Languages:</strong> {location.language.join(', ')}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No cities found</p>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LocationGuide;