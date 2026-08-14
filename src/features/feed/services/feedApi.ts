import apiClient from '../../../services/api/apiClient';

export interface NewsArticle {
  title: string;
  description: string | null;
  image: string | null;
  url: string;
  source: string;
  publishedAt: string;
}

export const feedApi = {
  async getNews(keyword?: string): Promise<NewsArticle[]> {
    const params = keyword ? `?q=${encodeURIComponent(keyword)}` : '';
    const response = await apiClient.get(`/feed/news${params}`);
    return response.data;
  },
};
