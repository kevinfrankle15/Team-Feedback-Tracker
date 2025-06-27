
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'employee';
  teamId?: string;
  managerId?: string;
}

export interface Feedback {
  id: string;
  managerId: string;
  employeeId: string;
  strengths: string;
  areasToImprove: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  createdAt: string;
  updatedAt: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  managerName: string;
  employeeName: string;
}

export interface Team {
  id: string;
  name: string;
  managerId: string;
  memberIds: string[];
}
