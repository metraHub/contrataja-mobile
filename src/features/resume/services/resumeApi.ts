import apiClient from '../../../services/api/apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ResumeExperience {
  id: string;
  profileId: string;
  resumeId: string | null;
  title: string;
  company: string;
  years: number;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  achievements: string | null;
  createdAt: string;
}

export interface ResumeEducation {
  id: string;
  profileId: string;
  resumeId: string | null;
  institution: string;
  degree: string;
  field: string;
  startYear: number | null;
  endYear: number | null;
  createdAt: string;
}

export interface Certificate {
  id: string;
  resumeId: string;
  name: string;
  issuer: string;
  issuedAt: string | null;
  expiresAt: string | null;
  credentialUrl: string | null;
  createdAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  summary: string | null;
  skills: string[];
  createdAt: string;
  updatedAt: string;
  experiences: ResumeExperience[];
  educations: ResumeEducation[];
  certificates: Certificate[];
}

export interface CreateResumePayload {
  summary?: string;
  skills?: string[];
  experienceIds?: string[];
  educationIds?: string[];
  certificates?: { name: string; issuer: string; issuedAt?: string; credentialUrl?: string }[];
}

export interface UpdateResumePayload {
  summary?: string;
  skills?: string[];
  experienceIds?: string[];
  educationIds?: string[];
}

export interface ExperiencePayload {
  title: string;
  company: string;
  years: number;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface EducationPayload {
  institution: string;
  degree: string;
  field: string;
  startYear?: number;
  endYear?: number;
}

export interface CertificatePayload {
  name: string;
  issuer: string;
  issuedAt?: string;
  expiresAt?: string;
  credentialUrl?: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const resumeApi = {
  /** Retorna null se o currículo ainda não foi criado (404) */
  async getMe(): Promise<Resume | null> {
    try {
      const res = await apiClient.get('/resume/me');
      return res.data;
    } catch (err: any) {
      if (err?.response?.status === 404) return null;
      throw err;
    }
  },

  async create(data: CreateResumePayload): Promise<Resume> {
    const res = await apiClient.post('/resume', data);
    return res.data;
  },

  async update(data: UpdateResumePayload): Promise<Resume> {
    const res = await apiClient.put('/resume', data);
    return res.data;
  },

  async remove(): Promise<void> {
    await apiClient.delete('/resume');
  },

  // ─── Experiences ────────────────────────────────────────────────────────────

  async addExperience(data: ExperiencePayload): Promise<ResumeExperience> {
    const res = await apiClient.post('/resume/experiences', data);
    return res.data;
  },

  async removeExperience(id: string): Promise<void> {
    await apiClient.delete(`/resume/experiences/${id}`);
  },

  // ─── Educations ─────────────────────────────────────────────────────────────

  async addEducation(data: EducationPayload): Promise<ResumeEducation> {
    const res = await apiClient.post('/resume/educations', data);
    return res.data;
  },

  async removeEducation(id: string): Promise<void> {
    await apiClient.delete(`/resume/educations/${id}`);
  },

  // ─── Certificates ───────────────────────────────────────────────────────────

  async addCertificate(data: CertificatePayload): Promise<Certificate> {
    const res = await apiClient.post('/resume/certificates', data);
    return res.data;
  },

  async updateCertificate(id: string, data: Partial<CertificatePayload>): Promise<Certificate> {
    const res = await apiClient.put(`/resume/certificates/${id}`, data);
    return res.data;
  },

  async removeCertificate(id: string): Promise<void> {
    await apiClient.delete(`/resume/certificates/${id}`);
  },
};
