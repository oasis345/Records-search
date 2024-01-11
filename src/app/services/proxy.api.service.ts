import { ApiService } from './api.service';

export class ProxyApiService<T extends ApiService> extends ApiService {
  constructor(public apiService: T) {
    super();
  }

  async getRanked(season: string, options?: { size?: number; startIndex?: number }): Promise<any> {
    const result = await this.apiService.getRanked(season, options);

    return result;
  }

  async getStatus(): Promise<any> {
    const result = await this.apiService.getStatus();

    return result;
  }

  async getContents(): Promise<any> {
    const result = await this.apiService.getContents();

    return result;
  }
}
