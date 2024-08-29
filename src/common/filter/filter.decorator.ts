import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { FilterPrisma, VALID_FILTER_OPERATOR } from './filter.dto';

/**
 * 필터 쿼리 추출 데코레이터
 */
export const Filter = createParamDecorator(
  (validFields: string[], ctx: ExecutionContext): FilterPrisma => {
    const request = ctx.switchToHttp().getRequest() as Request;
    const filters = request.query['filter'] as Record<
      string,
      Record<string, unknown>
    >;

    // 필터 정보 미지정시 빈 오브젝트 리턴
    if (!filters) {
      return {};
    }

    // 필터별 검증
    for (const propertyKey in filters) {
      // 필드 키 검증
      if (validFields.length !== 0 && !validFields.includes(propertyKey)) {
        throw new BadRequestException(
          `잘못된 필드명 쿼리입니다: '${propertyKey}' 필드명이 존재하지 않습니다.`,
        );
      }
      for (const filterKey in filters[propertyKey]) {
        // 필터 오퍼레이터 검증
        if (!VALID_FILTER_OPERATOR.includes(filterKey)) {
          throw new BadRequestException(
            `잘못된 필터 연산자 쿼리입니다: '${filterKey}' 연산자가 존재하지 않습니다. (유효 연산자: [${VALID_FILTER_OPERATOR.join(
              ',',
            )}])`,
          );
        }
      }
    }

    return filters;
  },
);
