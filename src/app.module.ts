// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DedicatedServerModule } from './dedicated-server/dedicated-server.module';
import { ConfigModule } from '@nestjs/config';
import { RankingController } from './ranking/ranking.controller';
import { RankingModule } from './ranking/ranking.module';

@Module({
  imports: [UserModule, DedicatedServerModule, ConfigModule.forRoot({
    envFilePath: process.env.NODE_ENV === 'dev' ? '.env.development' : '.env.production',
    isGlobal: true,
  }), RankingModule],
  controllers: [AppController, RankingController],
  providers: [AppService],
})
export class AppModule {}