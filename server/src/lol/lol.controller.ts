import { Controller, Get, Req } from '@nestjs/common';
import { LolService } from './lol.service';
import { Request } from 'express';

@Controller('api/lol')
export class LolController {
  constructor(private readonly lolService: LolService) {}

  @Get('getSummoner')
  async getSummoner(@Req() request: Request): Promise<any> {
    return await this.lolService.getSummoner(request.query as any);
  }

  @Get('getMatches')
  async getMatches(@Req() request: Request) {
    return await this.lolService.getMatches(request.query as any);
  }

  @Get('getLeaderBoard')
  async getLeaderBoard(@Req() request: Request) {
    return await this.lolService.getLeaderBoard(request.query as any);
  }
}
