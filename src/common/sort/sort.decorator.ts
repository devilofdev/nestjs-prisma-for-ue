import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { SortPrisma } from './sort.dto';

/**
 * 정렬 방향 입력 검증
 */
const validateSortOrder = (input: string): boolean => {
  return ['asc', 'desc'].includes(input.toLowerCase());
};

/**
 * 정렬 옵션 파싱 ({@link https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/sort-pagination.html#sorting 참조})
 * @param sortString "KEY:SORTORDER" 형식의 정렬 스트링 입력
 * @returns {[key]: 'asc' | 'desc'}
 */
const parseSingleSort = (
  sortString: string,
  validFields: string[] = [],
): Record<string, string> => {
  // 정렬 방향 미지정시 `id:desc` 로 기본 정렬
  if (sortString === '') {
    return { id: 'desc' };
  }

  // 정렬 스트링 파싱
  const [key, sortOrder] = sortString.split(':');

  // 필드 검증 Array에 없는 키값인 경우
  if (validFields.length !== 0 && !validFields.includes(key)) {
    throw new BadRequestException(
      `잘못된 필드명 쿼리입니다: '${key}' 필드명이 존재하지 않습니다.`,
    );
  }

  // 정렬 방향 미정
  if (sortOrder === undefined) return { [key]: 'asc' };

  // 정렬 방향 입력 검증
  if (!validateSortOrder(sortOrder)) {
    throw new BadRequestException(
      "잘못된 정렬 방향 쿼리입니다. (유효 방향: ['asc', 'desc'])",
    );
  }
  return { [key]: sortOrder.toLowerCase() };
};

/**
 * 정렬 쿼리 추출 데코레이터
 */
export const Sort = createParamDecorator(
  (validFields: string[] = [], ctx: ExecutionContext): SortPrisma => {
    const request = ctx.switchToHttp().getRequest() as Request;
    const sort = request.query['sort'];

    // 단일 정렬 파싱
    if (typeof sort === 'string') {
      return [parseSingleSort(sort, validFields)];
    }

    // 다수 정렬 파싱
    if (Array.isArray(sort)) {
      return sort.map((sortString) => {
        if (Array.isArray(sortString)) {
          throw new BadRequestException('잘못된 정렬(sort) 쿼리입니다.');
        }
        return parseSingleSort(sortString, validFields);
      });
    }

    return [{ id: 'desc' }];
  },
);
