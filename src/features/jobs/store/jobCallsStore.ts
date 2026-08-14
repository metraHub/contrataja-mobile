import { create } from 'zustand';
import { JobCall, JobMatch } from '../../../types/index';
import { jobCallsApi } from '../services/jobCallsApi';

interface JobCallsState {
  companyJobCalls: JobCall[];
  candidateMatches: JobMatch[];
  myCandidacies: JobMatch[];
  openJobCalls: JobCall[];
  isLoading: boolean;
  loadingIds: Set<string>;
  error: string | null;

  fetchCompanyJobCalls: () => Promise<void>;
  fetchCandidateMatches: () => Promise<void>;
  fetchMyCandidacies: () => Promise<void>;
  fetchOpenJobCalls: () => Promise<void>;
  createJobCall: (data: any) => Promise<any>;
  acceptJobCall: (jobCallId: string) => Promise<JobMatch>;
  rejectJobCall: (jobCallId: string) => Promise<void>;
  applyToJob: (jobCallId: string) => Promise<void>;
  addMatch: (match: JobMatch) => void;
  updateStatus: (jobCallId: string, status: string) => Promise<void>;
  deleteJobCall: (jobCallId: string) => Promise<void>;
}

export const useJobCallsStore = create<JobCallsState>((set, get) => ({
  companyJobCalls: [],
  candidateMatches: [],
  myCandidacies: [],
  openJobCalls: [],
  isLoading: false,
  loadingIds: new Set(),
  error: null,

  fetchCompanyJobCalls: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await jobCallsApi.findByCompany();
      set({ companyJobCalls: data, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Erro ao carregar vagas. Tente novamente.' });
    }
  },

  fetchCandidateMatches: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await jobCallsApi.findMatchesForCandidate();
      set({ candidateMatches: data, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Erro ao carregar matches. Tente novamente.' });
    }
  },

  fetchMyCandidacies: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await jobCallsApi.findMyCandidacies();
      set({ myCandidacies: data, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Erro ao carregar candidaturas. Tente novamente.' });
    }
  },

  fetchOpenJobCalls: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await jobCallsApi.findAllOpen();
      set({ openJobCalls: data, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Erro ao carregar vagas. Tente novamente.' });
    }
  },

  createJobCall: async (data) => {
    set({ isLoading: true });
    try {
      const result = await jobCallsApi.create(data);
      const current = get().companyJobCalls;
      set({ companyJobCalls: [result.jobCall, ...current], isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  acceptJobCall: async (jobCallId) => {
    const result = await jobCallsApi.accept(jobCallId);
    set({ candidateMatches: get().candidateMatches.filter((m) => m.jobCallId !== jobCallId) });
    return result;
  },

  rejectJobCall: async (jobCallId) => {
    await jobCallsApi.reject(jobCallId);
    set({ candidateMatches: get().candidateMatches.filter((m) => m.jobCallId !== jobCallId) });
  },

  applyToJob: async (jobCallId) => {
    const match = await jobCallsApi.apply(jobCallId);
    set({
      openJobCalls: get().openJobCalls.filter((j) => j.id !== jobCallId),
      // Adiciona/atualiza o match em myCandidacies para que MinhasCandidaturas mostre imediatamente
      myCandidacies: [match, ...get().myCandidacies.filter((m) => m.jobCallId !== jobCallId)],
    });
  },

  addMatch: (match) => {
    set({ candidateMatches: [match, ...get().candidateMatches] });
  },

  updateStatus: async (jobCallId, status) => {
    const ids = new Set(get().loadingIds);
    ids.add(jobCallId);
    set({ loadingIds: ids });
    try {
      const updated = await jobCallsApi.updateJobCallStatus(jobCallId, status);
      set({
        companyJobCalls: get().companyJobCalls.map((j) =>
          j.id === jobCallId ? { ...j, status: updated.status } : j,
        ),
      });
    } finally {
      const next = new Set(get().loadingIds);
      next.delete(jobCallId);
      set({ loadingIds: next });
    }
  },

  deleteJobCall: async (jobCallId) => {
    const ids = new Set(get().loadingIds);
    ids.add(jobCallId);
    set({ loadingIds: ids });
    try {
      await jobCallsApi.deleteJobCall(jobCallId);
      set({
        companyJobCalls: get().companyJobCalls.filter((j) => j.id !== jobCallId),
      });
    } finally {
      const next = new Set(get().loadingIds);
      next.delete(jobCallId);
      set({ loadingIds: next });
    }
  },
}));
