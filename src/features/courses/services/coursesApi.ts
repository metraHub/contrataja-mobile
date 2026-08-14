import apiClient from '../../../services/api/apiClient';
import { Course } from '../../../types';

export const coursesApi = {
  async findAll(category?: string): Promise<Course[]> {
    const response = await apiClient.get('/courses', {
      params: category ? { category } : undefined,
    });
    return response.data;
  },

  async findById(id: string): Promise<Course> {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },

  async create(data: any): Promise<Course> {
    const response = await apiClient.post('/courses', data);
    return response.data;
  },

  async findByInstitution(): Promise<Course[]> {
    const response = await apiClient.get('/courses/institution');
    return response.data;
  },
};
