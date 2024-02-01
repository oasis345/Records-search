import { Controller, Get, Req } from '@nestjs/common';
import { RiotService } from './riot.service';
import { Request } from 'express';

@Controller('api/riot')
export class RiotController {
  constructor(private readonly riotService: RiotService) {}

  @Get('getAccount')
  async getAccount(@Req() request: Request): Promise<any> {
    const querys = request.query as any;
    return await this.riotService.getAccount(querys);
  }
}
