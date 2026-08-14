import apiClient from '../../../services/api/apiClient';

export interface InterviewSession {
  id: string;
  interviewScheduleId: string;
  status: 'WAITING' | 'ACTIVE' | 'ENDED' | 'NO_SHOW';
  startedAt: string | null;
  endedAt: string | null;
}

export interface InterviewSessionJoinResponse {
  session: InterviewSession;
  token: string;
}

export const interviewSessionApi = {
  async start(jobCallId: string, candidateId: string): Promise<InterviewSessionJoinResponse> {
    const response = await apiClient.post(`/job-calls/${jobCallId}/interview-session/${candidateId}/start`);
    return response.data;
  },

  async join(jobCallId: string, candidateId: string): Promise<InterviewSessionJoinResponse> {
    const response = await apiClient.post(`/job-calls/${jobCallId}/interview-session/${candidateId}/join`);
    return response.data;
  },

  async getStatus(jobCallId: string, candidateId: string): Promise<InterviewSession | null> {
    const response = await apiClient.get(`/job-calls/${jobCallId}/interview-session/${candidateId}`);
    return response.data;
  },
};
