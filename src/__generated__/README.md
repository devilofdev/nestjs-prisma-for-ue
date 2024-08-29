
# 자동완성 폴더 구조 설명

## `keys` 폴더

> `schema.prisma`에 선언된 테이블별 필드명들로 구성되어 생성된 string[]

#### Keys 사용법

- Controller 코드에서 `@Pagination()` 또는 `@Filter()` 데코레이터에 검증용으로 전달 가능
- 코드 예제

  ```ts
  import { ApplicationKeys } from 'src/__generated__/keys';
  import { Filter, FilterPrisma } from 'src/common/filter';
  import { Sort, SortPrisma } from 'src/common/sort';

  @Get('applications')
  getApplications(
   @Sort(ApplicationKeys) sort: SortPrisma,
   @Filter(ApplicationKeys) filter: FilterPrisma,
  ) {
    ...
    return something;
  }
  ```
