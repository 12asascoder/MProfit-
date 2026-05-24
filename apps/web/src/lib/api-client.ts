// API Client for Next.js app to communicate with NestJS Backend
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api/v1';

export class ApiClient {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // In a real app, inject auth token from cookies or localStorage here
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    // Some endpoints might return empty responses (204)
    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  // Auth
  // Auth
  static async verifyPan(data: { pan: string; tenantSlug: string }) { 
    return this.request('/auth/pan/verify', { method: 'POST', body: JSON.stringify(data) }); 
  }
  static async verifyOtp(data: { referenceId: string; otp: string }) { 
    return this.request('/auth/otp/verify', { method: 'POST', body: JSON.stringify(data) }); 
  }
  static async getProfile() { return this.request('/auth/profile'); }

  // Portfolio
  static async getPortfolios() { return this.request('/portfolio'); }
  static async getPortfolioSummary(id: string) { return this.request(`/portfolio/${id}/summary`); }
  
  // Analytics
  static async getXIRR(portfolioId: string) { return this.request(`/analytics/xirr?portfolioId=${portfolioId}`); }
  static async getAssetAllocation(portfolioId: string) { return this.request(`/analytics/allocation?portfolioId=${portfolioId}`); }

  // AI & Copilot
  static async getInsights(portfolioId: string) { return this.request(`/ai/insights?portfolioId=${portfolioId}`); }
  static async startCopilot(portfolioId: string) { return this.request('/ai/copilot/start', { method: 'POST', body: JSON.stringify({ portfolioId }) }); }
  static async sendCopilotMessage(conversationId: string, content: string) { return this.request(`/ai/copilot/${conversationId}/message`, { method: 'POST', body: JSON.stringify({ content }) }); }
  static async getCopilotHistory(conversationId: string) { return this.request(`/ai/copilot/${conversationId}`); }
}
