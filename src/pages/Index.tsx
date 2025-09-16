import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, GraduationCap, Users, UserCheck, ArrowRight, Star, Target, TrendingUp } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            PathFinder
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Your comprehensive career guidance platform connecting Students, Parents, and Mentors 
            for personalized educational journeys and financial planning.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
              <a href="/auth">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-large bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-student/10 rounded-full w-fit">
                <GraduationCap className="h-8 w-8 text-student" />
              </div>
              <CardTitle className="text-student">For Students</CardTitle>
              <CardDescription>
                Personalized career guidance and roadmaps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-student" />
                Interactive career roadmaps
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-student" />
                Personalized recommendations
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-student" />
                Progress tracking & analytics
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-large bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-parent/10 rounded-full w-fit">
                <Users className="h-8 w-8 text-parent" />
              </div>
              <CardTitle className="text-parent">For Parents</CardTitle>
              <CardDescription>
                Financial planning and child progress tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-parent" />
                Child's progress monitoring
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-parent" />
                Scholarship & loan suggestions
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-parent" />
                Financial planning tools
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-large bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-mentor/10 rounded-full w-fit">
                <UserCheck className="h-8 w-8 text-mentor" />
              </div>
              <CardTitle className="text-mentor">For Mentors</CardTitle>
              <CardDescription>
                Guide students and track their success
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-mentor" />
                Student portfolio management
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-mentor" />
                Performance analytics
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-mentor" />
                Impact measurement
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="shadow-large bg-white/95 backdrop-blur-sm max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of students, parents, and mentors already using PathFinder 
                to achieve their educational and career goals.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <a href="/auth">
                  Create Your Account <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
