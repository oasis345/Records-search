import { Module } from '@nestjs/common';
import { RiotService } from './riot.service';
import { HttpModule } from '@nestjs/axios';
import { RiotController } from './riot.controller';
@Module({
  imports: [HttpModule],
  controllers: [RiotController],
  exports: [RiotService],
  providers: [RiotService],
})
export class RiotModule {}
