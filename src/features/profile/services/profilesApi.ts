import apiClient from '../../../services/api/apiClient';

export const profilesApi = {
  async getAvailableTalents() {
    const response = await apiClient.get('/profiles/pf/talents');
    return response.data;
  },

  async searchProfessionals(params: {
    query?: string;
    workMode?: string;
    minExperience?: string;
    areaAtuacao?: string;
  }) {
    const response = await apiClient.get('/profiles/pf/search', { params });
    return response.data;
  },

  async getProfilePFById(id: string) {
    const response = await apiClient.get(`/profiles/pf/${id}`);
    return response.data;
  },

  async getTalentByUserId(userId: string) {
    const response = await apiClient.get(`/profiles/pf/talent/${userId}`);
    return response.data;
  },

  // PF
  async createProfilePF(data: any) {
    const response = await apiClient.post('/profiles/pf', data);
    return response.data;
  },
  async updateProfilePF(data: any) {
    const response = await apiClient.put('/profiles/pf', data);
    return response.data;
  },
  async addExperience(data: any) {
    const response = await apiClient.post('/profiles/pf/experiences', data);
    return response.data;
  },
  async removeExperience(id: string) {
    const response = await apiClient.delete(`/profiles/pf/experiences/${id}`);
    return response.data;
  },
  async addEducation(data: any) {
    const response = await apiClient.post('/profiles/pf/educations', data);
    return response.data;
  },
  async removeEducation(id: string) {
    const response = await apiClient.delete(`/profiles/pf/educations/${id}`);
    return response.data;
  },

  // Company
  async getMyProfileCompany() {
    const response = await apiClient.get('/profiles/company/me');
    return response.data;
  },
  async createProfileCompany(data: any) {
    const response = await apiClient.post('/profiles/company', data);
    return response.data;
  },
  async updateProfileCompany(data: any) {
    const response = await apiClient.put('/profiles/company', data);
    return response.data;
  },

  // Provider
  async createProfileProvider(data: any) {
    const response = await apiClient.post('/profiles/provider', data);
    return response.data;
  },
  async updateProfileProvider(data: any) {
    const response = await apiClient.put('/profiles/provider', data);
    return response.data;
  },

  // Institution
  async createProfileInstitution(data: any) {
    const response = await apiClient.post('/profiles/institution', data);
    return response.data;
  },
  async updateProfileInstitution(data: any) {
    const response = await apiClient.put('/profiles/institution', data);
    return response.data;
  },
};
