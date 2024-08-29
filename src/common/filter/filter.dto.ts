import { Prisma } from '@prisma/client';

export type FilterKeys = keyof Prisma.StringNullableFilter;

/**
 * 유효 필터 오퍼레이터
 */
export const VALID_FILTER_OPERATOR = [
  'equals',
  'in',
  'notIn',
  'lt',
  'lte',
  'gt',
  'gte',
  'contains',
  'startsWith',
  'endsWith',
  'mode',
  'not',
];

/**
 * 필터 데코레이터가 리턴할 오브젝트
 */
export type FilterPrisma =
  | Record<
      string,
      | Prisma.IntFilter
      | Prisma.IntNullableFilter
      | Prisma.StringFilter
      | Prisma.StringNullableFilter
      | Prisma.DateTimeFilter
      | Prisma.DateTimeNullableFilter
    >
  | undefined;

/** 기본 조건절 필터 */
export const defaultWhereFilter = {
  deletedAt: null,
};
