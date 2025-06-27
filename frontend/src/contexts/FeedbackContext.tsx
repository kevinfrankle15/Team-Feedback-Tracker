
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Feedback } from '@/types';
import { apiService } from '@/services/api';

interface FeedbackContextType {
  feedbacks: Feedback[];
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFeedback: (id: string, updates: Partial<Feedback>) => Promise<void>;
  acknowledgeFeedback: (id: string) => Promise<void>;
  getFeedbacksForEmployee: (employeeId: string) => Feedback[];
  getFeedbacksForManager: (managerId: string) => Feedback[];
  refreshFeedbacks: () => Promise<void>;
  isLoading: boolean;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshFeedbacks = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getFeedback();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      refreshFeedbacks();
    }
  }, []);

  const addFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newFeedback = await apiService.createFeedback({
        employeeId: feedback.employeeId,
        strengths: feedback.strengths,
        areasToImprove: feedback.areasToImprove,
        sentiment: feedback.sentiment
      });
      setFeedbacks(prev => [newFeedback, ...prev]);
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw error;
    }
  };

  const updateFeedback = async (id: string, updates: Partial<Feedback>) => {
    try {
      const updatedFeedback = await apiService.updateFeedback(id, {
        strengths: updates.strengths,
        areasToImprove: updates.areasToImprove,
        sentiment: updates.sentiment
      });
      setFeedbacks(prev => prev.map(f => f.id === id ? updatedFeedback : f));
    } catch (error) {
      console.error('Error updating feedback:', error);
      throw error;
    }
  };

  const acknowledgeFeedback = async (id: string) => {
    try {
      const updatedFeedback = await apiService.acknowledgeFeedback(id);
      setFeedbacks(prev => prev.map(f => f.id === id ? updatedFeedback : f));
    } catch (error) {
      console.error('Error acknowledging feedback:', error);
      throw error;
    }
  };

  const getFeedbacksForEmployee = (employeeId: string) => {
    return feedbacks.filter(f => f.employeeId === employeeId);
  };

  const getFeedbacksForManager = (managerId: string) => {
    return feedbacks.filter(f => f.managerId === managerId);
  };

  return (
    <FeedbackContext.Provider value={{
      feedbacks,
      addFeedback,
      updateFeedback,
      acknowledgeFeedback,
      getFeedbacksForEmployee,
      getFeedbacksForManager,
      refreshFeedbacks,
      isLoading
    }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
