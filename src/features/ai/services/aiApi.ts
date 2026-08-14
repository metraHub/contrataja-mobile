import apiClient from '../../../services/api/apiClient';

export interface ResumeAnalysis {
  pontosFortres: string[];
  pontosAMelhorar: string[];
  resumoMelhorado: string;
}

export const aiApi = {
  async analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
    const response = await apiClient.post('/ai/analyze-resume', { resumeText });
    return response.data;
  },
};
