import { create } from 'zustand';
import { ServiceCall, ProfileServiceProvider } from '../../../types';
import { serviceCallsApi } from '../services/serviceCallsApi';

interface ServiceCallsState {
  requesterCalls: ServiceCall[];
  providerCalls: ServiceCall[];
  nearbyProviders: ProfileServiceProvider[];
  isLoading: boolean;
  error: string | null;

  fetchRequesterCalls: () => Promise<void>;
  fetchProviderCalls: () => Promise<void>;
  createServiceCall: (data: any) => Promise<any>;
  selectProvider: (serviceCallId: string, providerId: string) => Promise<void>;
  acceptServiceCall: (serviceCallId: string) => Promise<void>;
  rejectServiceCall: (serviceCallId: string) => Promise<void>;
  completeServiceCall: (serviceCallId: string, rating: number) => Promise<void>;
  setNearbyProviders: (providers: ProfileServiceProvider[]) => void;
}

export const useServiceCallsStore = create<ServiceCallsState>((set, get) => ({
  requesterCalls: [],
  providerCalls: [],
  nearbyProviders: [],
  isLoading: false,
  error: null,

  fetchRequesterCalls: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await serviceCallsApi.findByRequester();
      set({ requesterCalls: data, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Erro ao carregar chamados. Tente novamente.' });
    }
  },

  fetchProviderCalls: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await serviceCallsApi.findByProvider();
      set({ providerCalls: data, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Erro ao carregar chamados. Tente novamente.' });
    }
  },

  createServiceCall: async (data) => {
    set({ isLoading: true });
    try {
      const result = await serviceCallsApi.create(data);
      set({
        requesterCalls: [result.serviceCall, ...get().requesterCalls],
        nearbyProviders: result.nearbyProviders,
        isLoading: false,
      });
      return result;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  selectProvider: async (serviceCallId, providerId) => {
    await serviceCallsApi.selectProvider(serviceCallId, providerId);
    await get().fetchRequesterCalls();
  },

  acceptServiceCall: async (serviceCallId) => {
    await serviceCallsApi.accept(serviceCallId);
    await get().fetchProviderCalls();
  },

  rejectServiceCall: async (serviceCallId) => {
    await serviceCallsApi.reject(serviceCallId);
    set({
      providerCalls: get().providerCalls.filter((c) => c.id !== serviceCallId),
    });
  },

  completeServiceCall: async (serviceCallId, rating) => {
    await serviceCallsApi.complete(serviceCallId, rating);
    await get().fetchRequesterCalls();
  },

  setNearbyProviders: (providers) => set({ nearbyProviders: providers }),
}));
