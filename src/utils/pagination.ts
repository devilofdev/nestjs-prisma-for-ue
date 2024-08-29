import { PaginationPrisma } from 'src/common/pagination';

/**
 * 페이지네이션 skip, take -> page, pageSize 반환 함수
 * @param pagination 페이지네이션 정보
 * @returns pagination
 */
export const getPaginationParam = (pagination: PaginationPrisma) => {
  return {
    page:
      pagination.skip !== undefined ? pagination.skip / pagination.take + 1 : 1,
    pageSize: pagination.take,
  };
};
