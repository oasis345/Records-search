type Revalidate = 'hour' | 'day' | 'weekend';

export class HttpServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public retryable: boolean = false,
  ) {
    super(message);
    this.name = 'HttpServiceError';
    this.statusCode = statusCode ?? 500;
  }
}

interface RequestOptions {
  url: string;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  init?: RequestInit;
  revalidate?: Revalidate;
  timeout?: number;
  retries?: number;
}

const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];
const DEFAULT_TIMEOUT = 8000; // Vercel Free Tier 고려 (10초 제한)
const DEFAULT_RETRIES = 2;

export class HttpService {
  getRevalidateMap(revalidate: Revalidate) {
    const revalidateMap: Record<Revalidate, number> = {
      hour: 3600,
      day: 86400,
      weekend: 604800,
    };

    return revalidateMap[revalidate];
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<T = any>({
    url,
    params,
    headers,
    init,
    revalidate,
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
  }: RequestOptions): Promise<T> {
    // api_key를 params에서 분리하여 헤더로 전달
    const { api_key, ...restParams } = params || {};
    const queryParams = new URLSearchParams();

    Object.entries(restParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.set(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const fullURL = queryString ? `${url}?${queryString}` : url;

    // API 키가 있으면 헤더에 추가
    const requestHeaders: Record<string, string> = {
      ...headers,
    };
    if (api_key) {
      requestHeaders['X-Riot-Token'] = api_key;
    }

    let lastError: HttpServiceError | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // 재시도 시 지연
        if (attempt > 0) {
          const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 3000);
          await this.delay(backoffMs);
        }

        const response = await this.fetchWithTimeout(
          fullURL,
          {
            ...init,
            headers: requestHeaders,
            next: { revalidate: revalidate ? this.getRevalidateMap(revalidate) : undefined },
          },
          timeout,
        );

        const contentType = response.headers.get('Content-Type');

        let result;
        if (contentType && contentType.includes('application/json')) {
          result = await response.json();
        } else {
          result = await response.text();
        }

        if (!response.ok) {
          const errorMessage = result?.status?.message || result?.message || `HTTP Error ${response.status}`;
          const isRetryable = RETRYABLE_STATUS_CODES.includes(response.status);

          // Rate limit인 경우 더 긴 대기
          if (response.status === 429 && attempt < retries) {
            const retryAfter = response.headers.get('Retry-After');
            const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 2000;
            await this.delay(Math.min(waitTime, 5000));
            continue;
          }

          lastError = new HttpServiceError(errorMessage, response.status, isRetryable);

          if (!isRetryable || attempt === retries) {
            throw lastError;
          }
          continue;
        }

        return result;
      } catch (error: any) {
        // AbortError (timeout)
        if (error.name === 'AbortError') {
          lastError = new HttpServiceError('Request timeout', 408, true);
          if (attempt === retries) throw lastError;
          continue;
        }

        // HttpServiceError는 그대로 처리
        if (error instanceof HttpServiceError) {
          if (!error.retryable || attempt === retries) {
            throw error;
          }
          lastError = error;
          continue;
        }

        // 기타 네트워크 에러
        lastError = new HttpServiceError(
          error.message || 'Network error',
          0,
          true,
        );
        if (attempt === retries) throw lastError;
      }
    }

    throw lastError || new HttpServiceError('Unknown error', 500);
  }
}

export const httpService = new HttpService();
