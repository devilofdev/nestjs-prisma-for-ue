import { IsInt, IsString } from 'class-validator';

/**
 * 클라이언트로부터 받는 페이지네이션 쿼리
 */
export class PaginationQuery {
  /**
   * 페이지 번호
   */
  @IsInt()
  page?: number;
  /**
   * 한 페이지당 컨텐츠 크기
   */
  @IsInt()
  pageSize?: number;
  /**
   * 커서
   * @description 컨텐츠 고유 ID
   */
  @IsInt()
  cursor?: number;
  /**
   * 커서 시작으로부터 컨텐츠 갯수
   */
  @IsInt()
  take?: number;

  /**
   * 커서 시작으로부터 스킵하는 갯수
   */
  @IsInt()
  skip?: number;
}

/**
 * 페이지네이션 데코레이터가 리턴할 오브젝트
 */
export class PaginationPrisma {
  skip?: number;
  take?: number;
  cursor?: {
    id: number;
  };
}

/**
 * 페이지네이션 메타 정보
 */
export class PaginationMeta {
  /**
   * 페이지 번호
   */
  @IsInt()
  page?: number;
  /**
   * 페이지당 컨텐츠 크기
   */
  @IsInt()
  pageSize?: number;
  /**
   * 페이지 갯수
   */
  @IsInt()
  pageCount?: number;
  /**
   * 커서 시작 인덱스
   */
  @IsInt()
  start?: number;
  /**
   * 커서 시작으로부터 컨텐츠 갯수
   */
  @IsInt()
  limit?: number;
  /**
   * 총 컨텐츠수
   */
  @IsInt()
  total?: number;

  /**
   * 이전 컨텐츠 ID
   */
  @IsString()
  prevId?: string;

  /**
   * 다음 컨텐츠 ID
   */
  @IsString()
  nextId?: string;
}

/**
 * 페이지네이션 리턴 정보
 */
export class PaginationResponse<T = any> {
  /**
   * 요청한 데이터 목록
   */
  data: T[];
  /**
   * 페이지네이션 메타 정보
   */
  meta: PaginationMeta;
}
