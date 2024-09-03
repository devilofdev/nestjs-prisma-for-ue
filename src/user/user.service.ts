// src/user/user.service.ts

import { HttpException, HttpStatus, Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@configs/prisma.service'
import { Prisma } from '@prisma/client';
import { PaginationPrisma } from 'src/common/pagination';
import { SortPrisma } from 'src/common/sort';
import { getPaginationParam } from 'src/utils/pagination';
import { comparePassword, hashPassword } from 'src/utils/password';
import { RankingService } from 'src/ranking/ranking.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private rankingService: RankingService) { }

  async signup(data: Prisma.UserCreateInput & { passwordCheck: string }) {
    try {
      if (data.password !== data.passwordCheck)
        throw new BadRequestException('비밀번호가 일치하지 않습니다.');

      const user = await this.prisma.user.findUnique({
        where: { login_id: data.login_id, deleted_at: null }
      });

      if (user)
        throw new NotFoundException('이미 존재하는 아이디입니다.');

      // 비밀번호 암호화
      const hashedPassword = await hashPassword(data.password);

      const { passwordCheck, ...rest } = data;

      // 랭킹 조회
      const rank = await this.rankingService.getSignupRanking();

      // 회원가입 완료
      const createdUser = await this.prisma.user.create({
        data: {
          ...rest,
          password: hashedPassword,
          player_ranking: {
            create: {
              rank,
              score: 0,
              total_game: 0,
              total_win: 0,
              win_rate: 0,
            },
          },
        },
      })

      return {
        data: createdUser,
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(data: Pick<Prisma.UserCreateInput, 'login_id' | 'password'>) {
    try {
      const user = await this.prisma.user.findUnique({
        select: {
          id: true,
          login_id: true,
          username: true,
          password: true,
        },
        where: {
          login_id: data.login_id,
          deleted_at: null
        }
      });

      if (!user)
        throw new NotFoundException('존재하지 않는 아이디입니다.');

      const isPasswordCorrect = await comparePassword(data.password, user.password);

      if (!isPasswordCorrect)
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

      const { password, ...rest } = user;

      return {
        data: rest,
      }

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUsers(pagination: PaginationPrisma, orderBy: SortPrisma) {
    try {
      const total = await this.prisma.user.count({
        where: {
          deleted_at: null,
        },
        orderBy,
        ...pagination,
      });

      const data = await this.prisma.user.findMany({
        where: {
          deleted_at: null,
        },
        orderBy,
        ...pagination,
      });

      const { page, pageSize } = getPaginationParam(pagination);

      return {
        data,
        meta: {
          total,
          page,
          pageSize,
        }
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}