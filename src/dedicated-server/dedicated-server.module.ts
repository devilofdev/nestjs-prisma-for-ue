import { Module } from '@nestjs/common';
import { DedicatedServerService } from './dedicated-server.service';
import { HttpModule } from '@nestjs/axios';
import { DedicatedServerController } from './dedicated-server.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [DedicatedServerController],
  providers: [DedicatedServerService],
})
export class DedicatedServerModule {}
