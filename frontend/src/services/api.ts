
const API_BASE_URL = 'http://localhost:5000/api';

interface LoginResponse {
  access_token: string;
  user: any;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  async getFeedback() {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }

    return response.json();
  }

  async createFeedback(feedbackData: {
    employeeId: string;
    strengths: string;
    areasToImprove: string;
    sentiment: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(feedbackData)
    });

    if (!response.ok) {
      throw new Error('Failed to create feedback');
    }

    return response.json();
  }

  async updateFeedback(feedbackId: string, feedbackData: {
    strengths?: string;
    areasToImprove?: string;
    sentiment?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(feedbackData)
    });

    if (!response.ok) {
      throw new Error('Failed to update feedback');
    }

    return response.json();
  }

  async acknowledgeFeedback(feedbackId: string) {
    const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}/acknowledge`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to acknowledge feedback');
    }

    return response.json();
  }

  async getTeamMembers() {
    const response = await fetch(`${API_BASE_URL}/team/members`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch team members');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
