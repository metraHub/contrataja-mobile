import apiClient from '../../../services/api/apiClient';
import { ServiceCall, ProfileServiceProvider } from '../../../types';

export const serviceCallsApi = {
  async create(data: any): Promise<{ serviceCall: ServiceCall; nearbyProviders: ProfileServiceProvider[] }> {
    const response = await apiClient.post('/service-calls', data);
    return response.data;
  },

  async findNearby(lat: number, lng: number, serviceType: string): Promise<ProfileServiceProvider[]> {
    const response = await apiClient.get('/service-calls/nearby', {
      params: { lat, lng, serviceType },
    });
    return response.data;
  },

  async findByRequester(): Promise<ServiceCall[]> {
    const response = await apiClient.get('/service-calls/requester');
    return response.data;
  },

  async findByProvider(): Promise<ServiceCall[]> {
    const response = await apiClient.get('/service-calls/provider');
    return response.data;
  },

  async selectProvider(serviceCallId: string, providerId: string) {
    const response = await apiClient.post(`/service-calls/${serviceCallId}/select-provider`, { providerId });
    return response.data;
  },

  async accept(serviceCallId: string) {
    const response = await apiClient.post(`/service-calls/${serviceCallId}/accept`);
    return response.data;
  },

  async reject(serviceCallId: string) {
    const response = await apiClient.post(`/service-calls/${serviceCallId}/reject`);
    return response.data;
  },

  async complete(serviceCallId: string, rating: number) {
    const response = await apiClient.post(`/service-calls/${serviceCallId}/complete`, { rating });
    return response.data;
  },
};
