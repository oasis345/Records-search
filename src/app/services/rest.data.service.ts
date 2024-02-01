class HttpServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RestDataServiceError';
  }
}

export class HttpService {
  async get(options: { url: string; params?: any }) {
    try {
      const params = new URLSearchParams(options.params);
      const response = await fetch(`${options.url}?${params}`);
      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      throw new HttpServiceError('An error occurred in the RestDataService');
    }
  }
}

export const httpService = new HttpService();
