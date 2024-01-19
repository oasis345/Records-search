import RestDataService from './rest.data.service';

export interface ApiService {
  getContents?(): Promise<any>;
  getMatchIds?(id: string): Promise<string[]>;
  getAccount?(options: { name: string; region?: string; tag?: string }): Promise<any>;
}

export abstract class ApiService extends RestDataService {
  abstract getRanked(options: any): Promise<any>;
}
