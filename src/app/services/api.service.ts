import RestDataService from './rest.data.service';

export abstract class ApiService extends RestDataService {
  abstract getRanked(season: string, options?: { size?: number; startIndex?: number }): Promise<any>;

  abstract getStatus(): Promise<any>;

  abstract getContents(): Promise<any>;
}
