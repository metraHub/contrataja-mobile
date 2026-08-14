import apiClient from '../../../services/api/apiClient';
import { InterviewSchedule, InterviewScheduleState, JobCall, JobMatch } from '../../../types';

export interface DispatchStats {
  jobCallId: string;
  totalNotified: number;
  totalViewed: number;
  totalInterested: number;
  ranking: Array<{
    candidateId: string;
    name: string;
    score: number;
    aiReason: string | null;
    status: string;
    notifiedAt: string | null;
    viewedAt: string | null;
  }>;
}

export const jobCallsApi = {
  async create(data: any): Promise<{ jobCall: JobCall; matchesCount: number; matchedUserIds: string[] }> {
    const response = await apiClient.post('/job-calls', data);
    return response.data;
  },

  async findByCompany(): Promise<JobCall[]> {
    const response = await apiClient.get('/job-calls/company');
    return response.data;
  },

  async findMatchesForCandidate(): Promise<JobMatch[]> {
    const response = await apiClient.get('/job-calls/candidate');
    return response.data;
  },

  async findMyCandidacies(): Promise<JobMatch[]> {
    const response = await apiClient.get('/job-calls/my-candidacies');
    return response.data;
  },

  async findById(id: string): Promise<JobCall> {
    const response = await apiClient.get(`/job-calls/${id}`);
    return response.data;
  },

  async accept(jobCallId: string): Promise<JobMatch> {
    const response = await apiClient.post(`/job-calls/${jobCallId}/accept`);
    return response.data;
  },

  async reject(jobCallId: string): Promise<JobMatch> {
    const response = await apiClient.post(`/job-calls/${jobCallId}/reject`);
    return response.data;
  },

  async findAllOpen(): Promise<JobCall[]> {
    const response = await apiClient.get('/job-calls/open/all');
    return response.data;
  },

  async apply(jobCallId: string): Promise<JobMatch> {
    const response = await apiClient.post(`/job-calls/${jobCallId}/apply`);
    return response.data;
  },

  async updateJobCallStatus(jobCallId: string, status: string): Promise<JobCall> {
    const response = await apiClient.patch(`/job-calls/${jobCallId}/status`, { status });
    return response.data;
  },

  async deleteJobCall(jobCallId: string): Promise<void> {
    await apiClient.delete(`/job-calls/${jobCallId}`);
  },

  async markViewed(jobCallId: string): Promise<void> {
    await apiClient.patch(`/job-calls/${jobCallId}/view`);
  },

  async getDispatchStats(jobCallId: string): Promise<DispatchStats> {
    const response = await apiClient.get(`/job-calls/${jobCallId}/dispatch-stats`);
    return response.data;
  },

  async moveToInterview(jobCallId: string, candidateId: string): Promise<void> {
    await apiClient.post(`/job-calls/${jobCallId}/interview/${candidateId}`);
  },

  async acceptCandidate(jobCallId: string, candidateId: string): Promise<void> {
    await apiClient.post(`/job-calls/${jobCallId}/accept-candidate/${candidateId}`);
  },

  async rejectCandidate(jobCallId: string, candidateId: string): Promise<void> {
    await apiClient.post(`/job-calls/${jobCallId}/reject-candidate/${candidateId}`);
  },

  async proposeInterviewSchedule(jobCallId: string, candidateId: string, scheduledAt: string): Promise<InterviewSchedule> {
    const response = await apiClient.post(`/job-calls/${jobCallId}/interview-schedule/${candidateId}`, { scheduledAt });
    return response.data;
  },

  async getInterviewSchedule(jobCallId: string, candidateId: string): Promise<InterviewScheduleState> {
    const response = await apiClient.get(`/job-calls/${jobCallId}/interview-schedule/${candidateId}`);
    return response.data;
  },

  async acceptInterviewSchedule(jobCallId: string): Promise<InterviewSchedule> {
    const response = await apiClient.post(`/job-calls/${jobCallId}/interview-schedule/me/accept`);
    return response.data;
  },

  async declineInterviewSchedule(jobCallId: string): Promise<InterviewSchedule> {
    const response = await apiClient.post(`/job-calls/${jobCallId}/interview-schedule/me/decline`);
    return response.data;
  },
};
