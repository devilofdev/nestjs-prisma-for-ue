import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { PrismaService } from '@configs/prisma.service';

@Module({
  controllers: [RankingController],
  providers: [RankingService, PrismaService],
  exports: [RankingService]
})
export class RankingModule { }
