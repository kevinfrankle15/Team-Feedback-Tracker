import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { Feedback } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, Check, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import FeedbackForm from './FeedbackForm';
import { toast } from '@/hooks/use-toast';

interface FeedbackListProps {
  feedbacks: Feedback[];
  viewMode: 'manager' | 'employee';
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks, viewMode }) => {
  const { user } = useAuth();
  const { acknowledgeFeedback } = useFeedback();
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);
  const [acknowledgingIds, setAcknowledgingIds] = useState<Set<string>>(new Set());

  const handleAcknowledge = async (feedbackId: string) => {
    setAcknowledgingIds(prev => new Set(prev).add(feedbackId));
    
    try {
      await acknowledgeFeedback(feedbackId);
      toast({
        title: "Feedback Acknowledged",
        description: "Thank you for acknowledging the feedback."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to acknowledge feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAcknowledgingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(feedbackId);
        return newSet;
      });
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'Positive';
      case 'negative': return 'Needs Improvement';
      default: return 'Neutral';
    }
  };

  if (feedbacks.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <User className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
          <p className="text-gray-500">
            {viewMode === 'manager' 
              ? "You haven't given any feedback yet." 
              : "You haven't received any feedback yet."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((feedback) => (
        <Card key={feedback.id} className="relative">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg mb-1">
                  {viewMode === 'manager' 
                    ? `Feedback for ${feedback.employeeName}`
                    : `Feedback from ${feedback.managerName}`
                  }
                </CardTitle>
                <CardDescription className="flex items-center space-x-4">
                  <span>{format(new Date(feedback.createdAt), 'MMM dd, yyyy')}</span>
                  <Badge className={getSentimentColor(feedback.sentiment)}>
                    {getSentimentLabel(feedback.sentiment)}
                  </Badge>
                  {feedback.acknowledged ? (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      <Check className="h-3 w-3 mr-1" />
                      Acknowledged
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </CardDescription>
              </div>
              
              <div className="flex space-x-2">
                {viewMode === 'manager' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingFeedback(feedback)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {viewMode === 'employee' && !feedback.acknowledged && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAcknowledge(feedback.id)}
                    disabled={acknowledgingIds.has(feedback.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    {acknowledgingIds.has(feedback.id) ? 'Acknowledging...' : 'Acknowledge'}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
              <p className="text-gray-700">{feedback.strengths}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium text-blue-700 mb-2">Areas to Improve</h4>
              <p className="text-gray-700">{feedback.areasToImprove}</p>
            </div>
            
            {feedback.acknowledgedAt && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-green-700">
                  <Check className="h-4 w-4 inline mr-1" />
                  Acknowledged on {format(new Date(feedback.acknowledgedAt), 'MMM dd, yyyy')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {editingFeedback && (
        <FeedbackForm
          onClose={() => setEditingFeedback(null)}
          teamMembers={[]} // Not needed for editing
          editingFeedback={editingFeedback}
        />
      )}
    </div>
  );
};

export default FeedbackList;
