import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Wifi, WifiOff, Download, CheckCircle, Clock, Book, FileText, Video } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

const OfflineMode = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate('/');
      }
      setLoading(false);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    checkSession();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate]);

  const downloadableContent = [
    {
      id: 'career-quiz',
      title: 'Career Aptitude Quiz',
      description: 'Complete career assessment offline',
      type: 'quiz',
      size: '2.5 MB',
      icon: Book,
      downloaded: true,
      essential: true
    },
    {
      id: 'study-materials',
      title: 'Study Materials Pack',
      description: 'JEE/NEET preparation materials',
      type: 'documents',
      size: '15.2 MB',
      icon: FileText,
      downloaded: false,
      essential: true
    },
    {
      id: 'video-lectures',
      title: 'Physics Video Lectures',
      description: 'Top 10 most important topics',
      type: 'videos',
      size: '125 MB',
      icon: Video,
      downloaded: false,
      essential: false
    },
    {
      id: 'college-data',
      title: 'College Database',
      description: 'Complete college information',
      type: 'database',
      size: '8.7 MB',
      icon: Book,
      downloaded: true,
      essential: true
    },
    {
      id: 'mock-tests',
      title: 'Mock Test Series',
      description: '50 practice tests offline',
      type: 'tests',
      size: '12.3 MB',
      icon: FileText,
      downloaded: false,
      essential: true
    }
  ];

  const offlineFeatures = [
    {
      feature: 'Career Quiz',
      available: true,
      description: 'Take the full aptitude assessment'
    },
    {
      feature: 'College Search',
      available: true,
      description: 'Browse downloaded college database'
    },
    {
      feature: 'Study Materials',
      available: true,
      description: 'Access downloaded PDFs and notes'
    },
    {
      feature: 'Mock Tests',
      available: false,
      description: 'Requires download to use offline'
    },
    {
      feature: 'Progress Sync',
      available: false,
      description: 'Will sync when connection is restored'
    }
  ];

  const simulateDownload = (contentId: string) => {
    setDownloadProgress(prev => ({ ...prev, [contentId]: 0 }));
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        const currentProgress = prev[contentId] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [contentId]: currentProgress + 10 };
      });
    }, 200);
  };

  const totalDownloaded = downloadableContent.filter(item => item.downloaded).length;
  const totalItems = downloadableContent.length;
  const storageUsed = downloadableContent
    .filter(item => item.downloaded)
    .reduce((total, item) => total + parseFloat(item.size), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="h-6 w-6 text-green-600" />
            ) : (
              <WifiOff className="h-6 w-6 text-red-600" />
            )}
            <h1 className="text-xl font-bold">Offline Mode</h1>
          </div>
          <div className="ml-auto">
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Learn Anywhere, Anytime</h2>
          <p className="text-muted-foreground text-lg">
            Access core features with low or no internet connection
          </p>
        </div>

        {/* Connection Status */}
        <Card className={`mb-8 ${isOnline ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-600" />
              )}
              <CardTitle className={isOnline ? 'text-green-800' : 'text-red-800'}>
                {isOnline ? 'Connected to Internet' : 'Working Offline'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className={`${isOnline ? 'text-green-700' : 'text-red-700'}`}>
              {isOnline 
                ? 'All features available. Download content for offline use.' 
                : 'Using cached content. Some features may be limited until connection is restored.'
              }
            </p>
          </CardContent>
        </Card>

        {/* Storage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{totalDownloaded}/{totalItems}</div>
              <p className="text-sm text-muted-foreground">Content Downloaded</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{storageUsed.toFixed(1)} MB</div>
              <p className="text-sm text-muted-foreground">Storage Used</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((totalDownloaded / totalItems) * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">Offline Ready</p>
            </CardContent>
          </Card>
        </div>

        {/* Downloadable Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Download for Offline Use
            </CardTitle>
            <CardDescription>
              Download content to access it without an internet connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {downloadableContent.map((content) => {
                const IconComponent = content.icon;
                const progress = downloadProgress[content.id];
                const isDownloading = progress !== undefined && progress < 100;
                
                return (
                  <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${content.essential ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <IconComponent className={`h-5 w-5 ${content.essential ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{content.title}</h4>
                          {content.essential && (
                            <Badge variant="secondary" className="text-xs">Essential</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{content.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">{content.size}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground capitalize">{content.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {content.downloaded ? (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm text-green-600">Downloaded</span>
                        </div>
                      ) : isDownloading ? (
                        <div className="w-32">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs text-muted-foreground">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => simulateDownload(content.id)}
                          disabled={!isOnline}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Offline Features */}
        <Card>
          <CardHeader>
            <CardTitle>Available Features</CardTitle>
            <CardDescription>What you can access in offline mode</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {offlineFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      feature.available ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <div>
                      <p className="font-medium">{feature.feature}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  <Badge variant={feature.available ? "default" : "secondary"}>
                    {feature.available ? "Available" : "Limited"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips for Offline Use */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Tips for Better Offline Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Download essential content when you have a stable internet connection
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Your progress will automatically sync when you go back online  
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Quiz results and study data are saved locally and uploaded later
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Clear your browser cache regularly to free up storage space
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfflineMode;