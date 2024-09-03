import { PrismaService } from '@configs/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class RankingService {
    constructor(private prisma: PrismaService) { }

    async getRanking() {
    }

    /** 회원가입시 랭킹 조회
     * @returns 랭킹
     */
    async getSignupRanking() {
        try {
            // 회원가입시 PlayerRanking 테이블의 score가 0으로 입력됨에 따라
            // score가 0보다 큰 회원의 수를 조회하여 랭킹을 매다
            const ranking = await this.prisma.playerRanking.count({
                where: {
                    deleted_at: null,
                    score: {
                        gt: 0
                    },
                }
            });

            return ranking + 1;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

}
