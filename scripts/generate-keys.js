#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const { getDMMF } = require('@prisma/internals');
const rimraf = require('rimraf');
const { mkdirSync } = require('fs');

const README = `
# 자동완성 폴더 구조 설명

## \`keys\` 폴더

> \`schema.prisma\`에 선언된 테이블별 필드명들로 구성되어 생성된 string[]

#### Keys 사용법

- Controller 코드에서 \`@Pagination()\` 또는 \`@Filter()\` 데코레이터에 검증용으로 전달 가능
- 코드 예제

  \`\`\`ts
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
  \`\`\`
`;

// schema.prisma 파일 위치
const prismaDir = path.join(process.cwd(), 'prisma', 'schema.prisma');
// Generated 폴더
const generatedDir = path.join(process.cwd(), 'src', '__generated__');
// 결과 폴더
const outputDir = path.join(generatedDir, 'keys');

(async () => {
  try {
    if (!fs.existsSync(generatedDir)) {
      mkdirSync(generatedDir);
    }
    // 기존 폴더 초기화
    rimraf(outputDir + '/*', () => {});
    fs.mkdir(outputDir, () => {});

    // Prisma Schema로부터 DMMF 추출
    const {
      datamodel: { models },
    } = await getDMMF({ datamodelPath: prismaDir });
    const nameKeys = models.map(({ name, fields }) => {
      const keys = fields.reduce((res, { name, kind }) => {
        if (kind === 'scalar') res.push(name);
        return res;
      }, []);

      return [name, keys];
    });

    // 파일명 Array
    const fileNames = [];

    nameKeys.forEach(([name, fields]) => {
      const fileName = `${name}Keys`;
      fileNames.push(fileName);

      if (name === 'Space') {
        fields.push('enters', 'likes');
      }

      if (name === 'User') {
        fields.push('likeUsersOpponent', 'likeUsersMe');
      }

      // 파일 생성
      fs.writeFile(
        path.join(outputDir, fileName + '.ts'),
        `export const ${fileName} = ${JSON.stringify(fields)};`,
        () => {},
      );
    });

    // Default Export 생성
    const indexTs = fileNames.map((n) => `export * from "./${n}";`).join('\n');
    fs.writeFile(path.join(outputDir, 'index.ts'), indexTs, () => {});

    // README 생성
    fs.writeFile(path.join(generatedDir, 'README.md'), README, () => {});
  } catch (err) {
    console.error(err);
  }
})();
