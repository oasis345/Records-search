import RestDataService from './rest.data.service';

export interface ApiService {
  getContents?(): Promise<any>;
  getMatches?(id: string, start?: number): Promise<string[]>;
  getAccount?(options: { name: string; region?: string; tag?: string }): Promise<any>;
}

export abstract class ApiService extends RestDataService {
  abstract getRanked(options: any): Promise<any>;
}
