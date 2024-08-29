/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { has } from 'lodash/fp';
import { PaginationPrisma, PaginationQuery } from './pagination.dto';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/constants';

/**
 * 페이지네이션 쿼리 추출 데코레이터
 */
export const Pagination = createParamDecorator(
  (_: null, ctx: ExecutionContext): PaginationPrisma | undefined => {
    const request = ctx.switchToHttp().getRequest() as Request;
    const pagination = request.query['pagination'] as PaginationQuery;

    // 페이지네이션 미지정시 기본값
    if (!pagination) return {};

    // 커서기반 / 페이지 기반 페이지네이션 동시 사용 오류
    const isOffsetBased =
      has('page', pagination) || has('pageSize', pagination);
    const isCursorBased = has('cursor', pagination) || has('take', pagination);
    if (isOffsetBased && isCursorBased) {
      throw new BadRequestException(
        '페이지 기반 페이지네이션과 오프셋 기반 페이지네이션은 혼용이 불가능합니다.',
      );
    }

    // 커서 기반 페이지네이션
    if (isCursorBased) {
      const take = pagination.take ?? DEFAULT_PAGE_SIZE;
      const cursor = pagination.cursor ? { id: +pagination.cursor } : undefined;
      const skip = pagination.skip ?? 0;
      return {
        // skip: pagination.cursor ? 1 : 0,
        take: +take,
        skip: +skip,
        cursor,
      };
    }

    // 페이지 기반 페이지네이션
    // 입력 오류 확인
    if (pagination.page && pagination.page <= 0) {
      throw new BadRequestException(
        '잘못된 페이지(pagination[page]) 쿼리입니다. 페이지는 1부터 시작합니다. (page > 0)',
      );
    }
    if (pagination.pageSize && pagination.pageSize < 0) {
      throw new BadRequestException(
        '잘못된 페이지 크기(pagination[pageSize]) 쿼리입니다. 페이지 크기는 양수여야합니다. (pageSize > 0)',
      );
    }
    const take = pagination.pageSize;
    const skip = take
      ? ((pagination.page ?? DEFAULT_PAGE) - 1) *
        (pagination.pageSize ?? DEFAULT_PAGE_SIZE)
      : undefined;
    return {
      take: take ? +take : undefined,
      skip: skip ? +skip : undefined,
    };
  },
);
