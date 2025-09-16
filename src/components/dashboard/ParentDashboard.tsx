import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  PiggyBank,
  GraduationCap,
  Target,
  AlertCircle
} from 'lucide-react';

interface Profile {
  id: string;
  role: string;
  first_name: string;
  last_name: string;
}

interface ParentDashboardProps {
  profile: Profile;
}

const ParentDashboard = ({ profile }: ParentDashboardProps) => {
  const [parentProfile, setParentProfile] = useState<any>(null);
  const [childProfiles, setChildProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParentData();
  }, [profile]);

  const fetchParentData = async () => {
    try {
      // Fetch parent profile
      const { data: parentData } = await supabase
        .from('parent_profiles')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();

      // Fetch child profiles if parent profile exists
      let childData = [];
      if (parentData?.child_id) {
        const { data: studentData } = await supabase
          .from('student_profiles')
          .select(`
            *,
            profiles!inner(first_name, last_name, email)
          `)
          .eq('user_id', parentData.child_id);
        
        childData = studentData || [];
      }

      setParentProfile(parentData);
      setChildProfiles(childData);
    } catch (error) {
      console.error('Error fetching parent data:', error);
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
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Income</CardTitle>
            <DollarSign className="h-4 w-4 text-parent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-parent">
              {parentProfile?.annual_income ? formatCurrency(parentProfile.annual_income) : 'Not set'}
            </div>
            <p className="text-xs text-muted-foreground">Yearly household income</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Education Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {parentProfile?.savings_amount ? formatCurrency(parentProfile.savings_amount) : 'Not set'}
            </div>
            <p className="text-xs text-muted-foreground">Saved for education</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Children Tracked</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{childProfiles.length}</div>
            <p className="text-xs text-muted-foreground">Student profiles linked</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">78%</div>
            <p className="text-xs text-muted-foreground">Overall child progress</p>
            <Progress value={78} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Financial Overview & Child Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Planning */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-parent" />
                Financial Overview
              </CardTitle>
              <CardDescription>
                Manage your child's education financing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {parentProfile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Annual Income</p>
                      <p className="text-2xl font-bold text-parent">
                        {parentProfile.annual_income ? formatCurrency(parentProfile.annual_income) : 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Education Savings</p>
                      <p className="text-2xl font-bold text-success">
                        {parentProfile.savings_amount ? formatCurrency(parentProfile.savings_amount) : 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Occupation</p>
                      <p className="text-lg">{parentProfile.occupation || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Education</p>
                      <p className="text-lg">{parentProfile.education || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <Button>Update Financial Info</Button>
                      <Button variant="outline">Explore Scholarships</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Complete your financial profile to get personalized loan and scholarship recommendations</p>
                  <Button>Setup Financial Profile</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Child Progress */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-accent" />
                Child's Progress
              </CardTitle>
              <CardDescription>
                Track your child's academic and career development
              </CardDescription>
            </CardHeader>
            <CardContent>
              {childProfiles.length > 0 ? (
                <div className="space-y-6">
                  {childProfiles.map((child, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {child.profiles.first_name} {child.profiles.last_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{child.profiles.email}</p>
                        </div>
                        <Badge variant="secondary">
                          Grade {child.grade || 'Not Set'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Stream</p>
                          <p className="text-sm">{child.stream || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Career Goals</p>
                          <p className="text-sm">{child.career_goals || 'Not set'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Progress</p>
                          <div className="flex items-center gap-2">
                            <Progress value={75} className="flex-1" />
                            <span className="text-sm">75%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No child profiles linked yet</p>
                  <Button>Link Child Profile</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations & Alerts */}
        <div className="space-y-6">
          {/* Scholarship Alerts */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                Financial Alerts
              </CardTitle>
              <CardDescription>
                Scholarships and loan opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg border-success/20 bg-success/5">
                <h4 className="font-medium text-sm text-success">Merit Scholarship Available</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on your child's performance, they qualify for a ₹50,000 scholarship
                </p>
                <Button size="sm" variant="outline" className="mt-2 text-xs">
                  Apply Now
                </Button>
              </div>
              
              <div className="p-3 border rounded-lg border-warning/20 bg-warning/5">
                <h4 className="font-medium text-sm text-warning">Education Loan Options</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Low interest education loans available from partner banks
                </p>
                <Button size="sm" variant="outline" className="mt-2 text-xs">
                  Explore Loans
                </Button>
              </div>
              
              <div className="p-3 border rounded-lg border-info/20 bg-info/5">
                <h4 className="font-medium text-sm text-info">Savings Tip</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Start a SIP of ₹5,000/month to build your education fund
                </p>
                <Button size="sm" variant="outline" className="mt-2 text-xs">
                  Learn More
                </Button>
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
                <Target className="h-4 w-4" />
                View Child's Roadmap
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Mentor Session
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <PiggyBank className="h-4 w-4" />
                Financial Planning
              </Button>
            </CardContent>
          </Card>

          {/* Monthly Expenses */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-sm">Education Budget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tuition</span>
                <span className="text-sm font-medium">₹15,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Books & Materials</span>
                <span className="text-sm font-medium">₹3,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Online Courses</span>
                <span className="text-sm font-medium">₹2,000</span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="font-medium">Total Monthly</span>
                <span className="font-bold text-parent">₹20,000</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;