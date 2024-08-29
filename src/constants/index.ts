/**
 * 애플리케이션 고유 코드
 */
export const APP_NAME = 'ue-backend';

/**
 * 페이지네이션 기본 시작 페이지
 */
export const DEFAULT_PAGE = 1;

/**
 * 페이지네이션 기본 페이지 사이즈
 */
export const DEFAULT_PAGE_SIZE = 25;

/**
 * Bcrypt SALT 카운터
 */
export const SALT_COUNT = 10;

/**
 * 리프레시 토큰 발급 바이트
 */
export const REFRESH_TOKEN_BYTE = 20;

// 이미지 최적화 경계
/**
 * 큰 이미지 최소 너비
 */
export const LARGE_MIN_WIDTH = 1000;
/**
 * 중간 이미지 최소 너비
 */
export const MEDIUM_MIN_WIDTH = 700;
/**
 * 작은 이미지 최소 너비
 */
export const SMALL_MIN_WIDTH = 500;
/**
 * 썸네일 최소 너비
 */
export const THUMBNAIL_MIN_WIDTH = 300;

// 쿠키 키값
/**
 * 리프레시 토큰 쿠키 키값
 */
export const REFRESH_TOKEN_KEY = 'rftk';
/**
 * 액세스 토큰 쿠키 키값
 */
export const ACCESS_TOKEN_KEY = 'actk';
/**
 * 엑세스 인증 토큰
 */
export const ACCESS_AUTH_TOKEN = 'ACTK_AUTH';

// 시스템 생성/업데이트/삭제 유저타입
/**
 * 서버 최초 설정 생성자
 */
export const INITIAL_SETTINGS_USER = 'initial-default-settings';

// 코어 설정 키값
/**
 * 캐시 설정
 */
export const CACHE_SETTINGS = 'cache-settings';
/**
 * 업로드 프로바이더 설정
 */
export const UPLOAD_PROVIDER_SETTINGS = 'upload-provider';
/**
 * 쓰로틀 설정
 */
export const THROTTLE_SETTINGS = 'throttle-settings';
/**
 * 로그인 설정
 */
export const AUTH_TOKEN_SETTINGS = 'auth-token-settings';
/**
 * 퍼블릭 API 요청키
 */
export const IS_PUBLIC = 'IS_PUBLIC';
/**
 * 브라우저에서 조회 가능한 로그인 상태값
 */
export const IS_LOGGED_IN = 'loggedIn';

// MetaData 키값
/**
 * 로그인이 필요한 API 메타데이터 키
 */
export const NEED_LOGIN = 'NEED_LOGIN';
/**
 * 로그인한 유저 정보
 */
export const LOGGED_USER = 'logged-user';

// 기본 역할
/**
 * 슈퍼 관리자 코드
 */
export const SUPER_ADMIN_CODE = 'super-admin';
/**
 * 컨텐츠 관리자 코드
 */
export const CONTENTS_ADMIN_CODE = 'contents-admin';

// 기본 유저명
/**
 * 시스템
 */
export const SYSTEM_USER = 'SYSTEM';

// CORS-SETTING
export const CORS_SETTINGS = 'cors-settings';
