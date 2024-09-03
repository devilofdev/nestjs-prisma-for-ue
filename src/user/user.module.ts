import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '@configs/prisma.service';
import { RankingModule } from 'src/ranking/ranking.module';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  imports: [RankingModule],
})
export class UserModule { }
