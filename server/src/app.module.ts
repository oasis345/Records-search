import { Module } from '@nestjs/common';
import { LolModule } from './lol/lol.module';
import { ConfigModule } from '@nestjs/config';
import { RiotModule } from './riot/riot.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.prod.env' }), LolModule, RiotModule],
})
export class AppModule {}
