
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import FeedbackList from './FeedbackList';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { getFeedbacksForEmployee } = useFeedback();
  
  const employeeFeedbacks = getFeedbacksForEmployee(user?.id || '');
  
  const acknowledgedCount = employeeFeedbacks.filter(f => f.acknowledged).length;
  const pendingCount = employeeFeedbacks.filter(f => !f.acknowledged).length;
  
  const sentimentCounts = employeeFeedbacks.reduce((acc, feedback) => {
    acc[feedback.sentiment] = (acc[feedback.sentiment] || 0) + 1;
    return acc;
  }, { positive: 0, neutral: 0, negative: 0 });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Your Feedback</h2>
        <p className="text-gray-600">Track your progress and development</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeFeedbacks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{acknowledgedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Feedback</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{sentimentCounts.positive}</div>
            <p className="text-xs text-muted-foreground">
              {employeeFeedbacks.length > 0 ? Math.round((sentimentCounts.positive / employeeFeedbacks.length) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Timeline</CardTitle>
          <CardDescription>
            Your feedback history from your manager
          </CardDescription>
        </CardHeader>
        <CardContent>
          {employeeFeedbacks.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
              <p className="text-gray-500">Your manager hasn't provided any feedback yet.</p>
            </div>
          ) : (
            <FeedbackList feedbacks={employeeFeedbacks} viewMode="employee" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
