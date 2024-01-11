export default class RestDataService {
  protected async get(options: { url: string; params?: any }) {
    const response = await fetch(`https://${options.url}`);
    const data = await response.json();

    return data;
  }
}
