import apiClient from '../../../services/api/apiClient';
import { AuthResponse, RegisterData, LoginData } from '../../../types';

export interface RegisterWithSMSData {
  email: string;
  password: string;
  type: string;
  fullName: string;
  gender: string;
  phone: string;
  birthDate?: string;
}

export interface RegisterWithSMSResponse {
  userId: string;
  phone: string;
  message: string;
}

export const authApi = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async registerWithSMS(data: RegisterWithSMSData): Promise<RegisterWithSMSResponse> {
    const response = await apiClient.post<RegisterWithSMSResponse>('/auth/register', data);
    return response.data;
  },

  async verifySMS(userId: string, code: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/verify-sms', { userId, code });
    return response.data;
  },

  async resendSMS(userId: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/resend-sms', { userId });
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async getMe() {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  async setDisponivel(disponivel: boolean) {
    const response = await apiClient.patch('/users/me/disponivel', { disponivel });
    return response.data;
  },

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/request-reset', { email });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },

  async deleteAccount(): Promise<void> {
    await apiClient.delete('/users/me');
  },
};
