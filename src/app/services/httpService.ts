export class HttpServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.statusCode = statusCode ?? 500;
  }
}

export class HttpService {
  async get<T>({ url, params }: { url: string; params?: any }): Promise<T> {
    const queryParams = new URLSearchParams(params);
    const fullURL = params ? `${url}?${queryParams.toString()}` : url;

    try {
      const response = await fetch(fullURL, { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) {
        console.error(result?.message ?? result?.status?.message);
        throw new HttpServiceError(result.message ?? result.status?.message, response.status);
      }

      return result;
    } catch (error: any) {
      throw new HttpServiceError(error.message, error.status);
    }
  }
}

export const httpService = new HttpService();
