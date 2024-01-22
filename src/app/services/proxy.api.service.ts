import { ApiService } from './api.service';

export class ProxyApiService<T extends ApiService> extends ApiService {
  constructor(public apiService: T) {
    super();
  }
  async getAccount<T>(options: { name: string; region?: string; tag?: string }): Promise<T> {
    const result = await this.apiService.getAccount?.(options);

    return result;
  }

  async getRanked(options: any): Promise<any> {
    const result = await this.apiService.getRanked(options);

    return result;
  }

  async getMatches(id: string, start?: number): Promise<any> {
    const result = await this.apiService.getMatches?.(id, start);

    return result;
  }

  async getContents(): Promise<any> {
    const result = await this.apiService.getContents?.();

    return result;
  }
}
