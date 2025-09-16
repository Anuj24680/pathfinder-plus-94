import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';  
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calendar, 
  Award,
  MapPin,
  Star,
  CheckCircle2
} from 'lucide-react';

interface Profile {
  id: string;
  role: string;
  first_name: string;
  last_name: string;
}

interface StudentDashboardProps {
  profile: Profile;
}

const StudentDashboard = ({ profile }: StudentDashboardProps) => {
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, [profile]);

  const fetchStudentData = async () => {
    try {
      // Fetch student profile
      const { data: studentData } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();

      // Fetch recommendations
      const { data: recommendationsData } = await supabase
        .from('recommendations')
        .select('*')
        .eq('student_id', profile.id)
        .order('relevance_score', { ascending: false })
        .limit(6);

      // Fetch roadmaps
      const { data: roadmapsData } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false });

      setStudentProfile(studentData);
      setRecommendations(recommendationsData || []);
      setRoadmaps(roadmapsData || []);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'career': return 'bg-student text-white';
      case 'college': return 'bg-accent text-white';
      case 'course': return 'bg-success text-white';
      case 'scholarship': return 'bg-warning text-white';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Career Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-student" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-student">85%</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roadmap Progress</CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">67%</div>
            <p className="text-xs text-muted-foreground">3 of 5 milestones</p>
            <Progress value={67} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Acquired</CardTitle>
            <Award className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">12</div>
            <p className="text-xs text-muted-foreground">+3 this quarter</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
            <Star className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{recommendations.length}</div>
            <p className="text-xs text-muted-foreground">New suggestions available</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile & Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Profile */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-student" />
                Your Profile
              </CardTitle>
              <CardDescription>
                Complete your profile to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {studentProfile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Grade</p>
                    <p className="text-lg">{studentProfile.grade || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Stream</p>
                    <p className="text-lg">{studentProfile.stream || 'Not specified'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Career Goals</p>
                    <p className="text-sm">{studentProfile.career_goals || 'No goals specified yet'}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Complete your student profile to unlock personalized features</p>
                  <Button>Complete Profile</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Roadmap */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" />
                Your Roadmap
              </CardTitle>
              <CardDescription>
                Track your progress towards your career goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {roadmaps.length > 0 ? (
                <div className="space-y-4">
                  {roadmaps.slice(0, 1).map((roadmap) => (
                    <div key={roadmap.id} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{roadmap.title}</h3>
                        <Badge variant="secondary">{roadmap.progress}% Complete</Badge>
                      </div>
                      <Progress value={roadmap.progress} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {roadmap.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Created {new Date(roadmap.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View Full Roadmap
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No roadmap created yet</p>
                  <Button>Create Your Roadmap</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-warning" />
                Recommendations
              </CardTitle>
              <CardDescription>
                Personalized suggestions for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <div key={rec.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{rec.title}</h4>
                      <Badge className={`text-xs ${getTypeColor(rec.type)}`}>
                        {rec.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {rec.description}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-3 w-3 text-warning fill-current" />
                      <span className="text-xs text-muted-foreground">
                        {rec.relevance_score}% match
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Star className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Complete your profile to get recommendations
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Update Profile
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <Target className="h-4 w-4" />
                Set New Goal
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <BookOpen className="h-4 w-4" />
                Explore Courses
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;