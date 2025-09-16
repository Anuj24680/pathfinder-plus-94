import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { 
  UserCheck, 
  Users, 
  TrendingUp, 
  Calendar,
  Star,
  MessageSquare,
  BookOpen,
  Target,
  Clock
} from 'lucide-react';

interface Profile {
  id: string;
  role: string;
  first_name: string;
  last_name: string;
}

interface MentorDashboardProps {
  profile: Profile;
}

const MentorDashboard = ({ profile }: MentorDashboardProps) => {
  const [mentorProfile, setMentorProfile] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentorData();
  }, [profile]);

  const fetchMentorData = async () => {
    try {
      // Fetch mentor profile
      const { data: mentorData } = await supabase
        .from('mentor_profiles')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();

      // Fetch students (for demo, we'll get all student profiles)
      const { data: studentsData } = await supabase
        .from('student_profiles')
        .select(`
          *,
          profiles!inner(first_name, last_name, email)
        `)
        .limit(5);

      setMentorProfile(mentorData);
      setStudents(studentsData || []);
    } catch (error) {
      console.error('Error fetching mentor data:', error);
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-mentor" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-mentor">24</div>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mentor Rating</CardTitle>
            <Star className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning flex items-center gap-1">
              {mentorProfile?.rating || '0.0'}
              <Star className="h-4 w-4 fill-current" />
            </div>
            <p className="text-xs text-muted-foreground">Average rating</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {mentorProfile?.experience_years || 0}
            </div>
            <p className="text-xs text-muted-foreground">Years of experience</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions Today</CardTitle>
            <Calendar className="h-4 w-4 text-student" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-student">5</div>
            <p className="text-xs text-muted-foreground">2 upcoming</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile & Students */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mentor Profile */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-mentor" />
                Your Mentor Profile
              </CardTitle>
              <CardDescription>
                Manage your expertise and availability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mentorProfile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Experience</p>
                      <p className="text-lg">{mentorProfile.experience_years} years</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Qualification</p>
                      <p className="text-lg">{mentorProfile.qualification || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Expertise Areas</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mentorProfile.expertise_areas && Array.isArray(mentorProfile.expertise_areas) ? 
                        mentorProfile.expertise_areas.map((area: string, index: number) => (
                          <Badge key={index} variant="secondary">{area}</Badge>
                        )) : 
                        <Badge variant="outline">No expertise areas set</Badge>
                      }
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bio</p>
                    <p className="text-sm text-muted-foreground">
                      {mentorProfile.bio || 'No bio added yet'}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button>Update Profile</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Complete your mentor profile to start helping students</p>
                  <Button>Setup Mentor Profile</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Students */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-student" />
                Your Students
              </CardTitle>
              <CardDescription>
                Recent student interactions and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {students.length > 0 ? (
                <div className="space-y-4">
                  {students.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-student text-white">
                            {getInitials(student.profiles.first_name, student.profiles.last_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {student.profiles.first_name} {student.profiles.last_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Grade {student.grade || 'Not Set'} • {student.stream || 'Stream not set'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium">Progress</p>
                          <div className="flex items-center gap-2">
                            <Progress value={Math.floor(Math.random() * 100)} className="w-16" />
                            <span className="text-xs">{Math.floor(Math.random() * 100)}%</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Students
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No students assigned yet</p>
                  <Button>Browse Available Students</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule & Actions */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-student" />
                Today's Schedule
              </CardTitle>
              <CardDescription>
                Your upcoming sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg border-student/20 bg-student/5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">Career Guidance Session</h4>
                  <Badge variant="secondary" className="text-xs">10:00 AM</Badge>
                </div>
                <p className="text-xs text-muted-foreground">with Priya Sharma</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  45 minutes
                </div>
              </div>
              
              <div className="p-3 border rounded-lg border-accent/20 bg-accent/5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">College Selection</h4>
                  <Badge variant="secondary" className="text-xs">2:00 PM</Badge>
                </div>
                <p className="text-xs text-muted-foreground">with Rahul Kumar</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  30 minutes
                </div>
              </div>
              
              <div className="p-3 border rounded-lg border-success/20 bg-success/5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">Mock Interview</h4>
                  <Badge variant="secondary" className="text-xs">4:30 PM</Badge>
                </div>
                <p className="text-xs text-muted-foreground">with Anjali Patel</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  60 minutes
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Session
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <MessageSquare className="h-4 w-4" />
                Message Student
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <Target className="h-4 w-4" />
                Update Roadmap
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <BookOpen className="h-4 w-4" />
                Add Resources
              </Button>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-sm">This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sessions Completed</span>
                <span className="text-sm font-medium">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg. Session Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-warning fill-current" />
                  <span className="text-sm font-medium">4.8</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Response Time</span>
                <span className="text-sm font-medium">< 2 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Student Success Rate</span>
                <span className="text-sm font-medium text-success">94%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;