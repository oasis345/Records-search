export default class RestDataService {
  protected async get(options: { url: string; params?: any }) {
    try {
      const response = await fetch(`https://${options.url}`, { cache: 'force-cache' });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}
