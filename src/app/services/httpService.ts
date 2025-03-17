type Revalidate = 'hour' | 'day' | 'weekend';

const isServer = () => typeof window === 'undefined';

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
  getRevalidateMap(revalidate: Revalidate) {
    const revalidateMap: Record<Revalidate, number> = {
      hour: 3600,
      day: 86400,
      weekend: 604800,
    };

    return revalidateMap[revalidate];
  }

  async get<T = any>({
    url,
    params,
    init,
    revalidate,
  }: {
    url: string;
    params?: any;
    init?: RequestInit;
    revalidate?: Revalidate;
  }): Promise<T> {
    const queryParams = new URLSearchParams(params);
    const fullURL = params ? `${url}?${queryParams.toString()}` : url;

    try {
      const response = await fetch(fullURL, {
        ...init,
        next: { revalidate: revalidate ? this.getRevalidateMap(revalidate) : undefined },
      });
      const contentType = response.headers.get('Content-Type');

      let result;
      if (contentType && contentType.includes('application/json')) {
        // JSON 응답일 경우
        result = await response.json();
      } else {
        result = await response.text();
      }
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
