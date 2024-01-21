class RestDataServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RestDataServiceError';
  }
}

export default class RestDataService {
  protected async get(options: { url: string; params?: any }) {
    try {
      const response = await fetch(`https://${options.url}`);
      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      throw new RestDataServiceError('An error occurred in the RestDataService');
    }
  }
}
