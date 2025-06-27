import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, TrendingUp, Users, MessageSquare, CheckCircle } from 'lucide-react';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';
import { apiService } from '@/services/api';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const { getFeedbacksForManager } = useFeedback();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [teamMembers, setTeamMembers] = useState<Array<{ id: string; name: string; email: string }>>([]);
  
  const managerFeedbacks = getFeedbacksForManager(user?.id || '');

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const members = await apiService.getTeamMembers();
        setTeamMembers(members);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    if (user?.role === 'manager') {
      fetchTeamMembers();
    }
  }, [user]);

  const sentimentCounts = managerFeedbacks.reduce((acc, feedback) => {
    acc[feedback.sentiment] = (acc[feedback.sentiment] || 0) + 1;
    return acc;
  }, { positive: 0, neutral: 0, negative: 0 });

  const acknowledgedCount = managerFeedbacks.filter(f => f.acknowledged).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manager Dashboard</h2>
          <p className="text-gray-600">Manage feedback for your team</p>
        </div>
        <Button onClick={() => setShowFeedbackForm(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Give Feedback
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managerFeedbacks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acknowledgedCount}</div>
            <p className="text-xs text-muted-foreground">
              {managerFeedbacks.length > 0 ? Math.round((acknowledgedCount / managerFeedbacks.length) * 100) : 0}% rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentimentCounts.positive}</div>
            <p className="text-xs text-muted-foreground">
              {managerFeedbacks.length > 0 ? Math.round((sentimentCounts.positive / managerFeedbacks.length) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="team" className="space-y-4">
        <TabsList>
          <TabsTrigger value="team">Team Overview</TabsTrigger>
          <TabsTrigger value="feedback">Feedback History</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Team</CardTitle>
              <CardDescription>
                Overview of your team members and their feedback status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => {
                  const memberFeedbacks = managerFeedbacks.filter(f => f.employeeId === member.id);
                  const latestFeedback = memberFeedbacks[0];
                  
                  return (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-indigo-100 rounded-full w-10 h-10 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">{memberFeedbacks.length} feedback(s)</div>
                          {latestFeedback && (
                            <Badge 
                              variant={
                                latestFeedback.sentiment === 'positive' ? 'default' :
                                latestFeedback.sentiment === 'neutral' ? 'secondary' : 'destructive'
                              }
                              className="mt-1"
                            >
                              {latestFeedback.sentiment}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <FeedbackList feedbacks={managerFeedbacks} viewMode="manager" />
        </TabsContent>
      </Tabs>

      {showFeedbackForm && (
        <FeedbackForm 
          onClose={() => setShowFeedbackForm(false)}
          teamMembers={teamMembers}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
