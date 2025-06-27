
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FeedbackFormProps {
  onClose: () => void;
  teamMembers: Array<{ id: string; name: string; email: string }>;
  editingFeedback?: any;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onClose, teamMembers, editingFeedback }) => {
  const { user } = useAuth();
  const { addFeedback, updateFeedback } = useFeedback();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeId: editingFeedback?.employeeId || '',
    strengths: editingFeedback?.strengths || '',
    areasToImprove: editingFeedback?.areasToImprove || '',
    sentiment: editingFeedback?.sentiment || 'neutral'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.strengths.trim() || !formData.areasToImprove.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedEmployee = teamMembers.find(m => m.id === formData.employeeId);
      
      if (editingFeedback) {
        await updateFeedback(editingFeedback.id, {
          strengths: formData.strengths,
          areasToImprove: formData.areasToImprove,
          sentiment: formData.sentiment as 'positive' | 'neutral' | 'negative'
        });
        toast({
          title: "Feedback Updated",
          description: "The feedback has been successfully updated."
        });
      } else {
        await addFeedback({
          managerId: user?.id || '',
          employeeId: formData.employeeId,
          managerName: user?.name || '',
          employeeName: selectedEmployee?.name || '',
          strengths: formData.strengths,
          areasToImprove: formData.areasToImprove,
          sentiment: formData.sentiment as 'positive' | 'neutral' | 'negative',
          acknowledged: false
        });
        toast({
          title: "Feedback Submitted",
          description: `Feedback for ${selectedEmployee?.name} has been submitted successfully.`
        });
      }
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingFeedback ? 'Edit Feedback' : 'Give Feedback'}
          </DialogTitle>
          <DialogDescription>
            {editingFeedback 
              ? 'Update the feedback details below.'
              : 'Provide structured feedback for your team member.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingFeedback && (
            <div className="space-y-2">
              <Label htmlFor="employee">Team Member *</Label>
              <Select value={formData.employeeId} onValueChange={(value) => setFormData({...formData, employeeId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="strengths">Strengths *</Label>
            <Textarea
              id="strengths"
              value={formData.strengths}
              onChange={(e) => setFormData({...formData, strengths: e.target.value})}
              placeholder="What are they doing well? Highlight their key strengths..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="areasToImprove">Areas to Improve *</Label>
            <Textarea
              id="areasToImprove"
              value={formData.areasToImprove}
              onChange={(e) => setFormData({...formData, areasToImprove: e.target.value})}
              placeholder="What could they work on? Provide constructive suggestions..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sentiment">Overall Sentiment</Label>
            <Select value={formData.sentiment} onValueChange={(value) => setFormData({...formData, sentiment: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Needs Improvement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : editingFeedback ? 'Update Feedback' : 'Submit Feedback'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackForm;
