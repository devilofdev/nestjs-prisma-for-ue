#! /usr/bin/env node
const { spawnSync } = require('node:child_process');
const { readFileSync } = require('fs');
const { join, resolve } = require('path');
const packageJson = require('../package.json');
const gitBlame = require('git-blame');
const _ = require('lodash');
const { sync: globSync } = require('glob');
const { PrismaClient } = require('@prisma/client');
const { Logger } = require('@nestjs/common');

const SYNC_SERVICE = 'SynchronizeApiScript';

/**
 * 스크립트 유저
 */
let SCRIPT_USER = 'sync-api-script';
const authors = [];
const getScriptUser = async (filepath, lineNumber) => {
  return new Promise((resolve, reject) => {
    gitBlame(join(process.cwd(), '.git'), { file: join('src', filepath) })
      .on('data', (type, data) => {
        if (type === 'commit') {
          resolve(`${data.author.name} <${data.author.mail}>`);
        }
      })
      .on('error', (err) => reject(err));
  });
};
const gitUsername = spawnSync('git', ['config', '--global', 'user.name'])
  .stdout.toString()
  .replace('\n', '');
const gitEmail = spawnSync('git', ['config', '--global', 'user.email'])
  .stdout.toString()
  .replace('\n', '');
const currentDeveloper = `${gitUsername} <${gitEmail}>`;

// Prisma 연결
const prisma = new PrismaClient();
prisma.$connect();

// 애플리케이션 이름
const APP_NAME = packageJson.name;

/**
 * DB에 애플리케이션 생성 및 업데이트
 */
const upsertApp = async () => {
  const app = await prisma.application.upsert({
    create: {
      name: APP_NAME,
      createdBy: SCRIPT_USER,
    },
    update: {
      name: APP_NAME,
      updatedBy: SCRIPT_USER,
    },
    where: { name: APP_NAME },
  });
  Logger.log(
    `애플리케이션 (Application) DB에 {${APP_NAME}} Upsert.`,
    SYNC_SERVICE,
  );
  return app.id;
};

/**
 * DB에 선언된 API 목록 조회
 * @type {(appId: number) => Promise<import("@prisma/client").Api[]>}
 */
const getDbApis = async (appId) => {
  return await prisma.api.findMany({
    where: { applicationId: appId, deletedAt: null },
    select: { code: true, method: true, endpoint: true, sourceFile: true },
  });
};

/**
 * DB에 API 생성
 * @type {(appId: number, api: import("@prisma/client").Api) => number}
 */
const createApi = async (appId, api, idx) => {
  const newApi = await prisma.api.upsert({
    create: {
      ...api,
      applicationId: appId,
      createdBy: authors[idx],
    },
    update: {
      ...api,
      applicationId: appId,
      deletedAt: null,
      deletedBy: null,
    },
    where: {
      code: api.code,
    },
  });
  Logger.log(`신규 API DB에 추가. {${newApi.code}}`, SYNC_SERVICE);
  // Super-Admin 역할에 권한 추가
  const superAdmin = await prisma.adminRole.findUnique({
    where: { code: 'super-admin' },
  });
  if (superAdmin) {
    await prisma.adminRole.update({
      where: {
        code: 'super-admin',
      },
      data: {
        apis: {
          create: [
            {
              apiId: newApi.id,
            },
          ],
        },
      },
    });
    Logger.log(
      `신규 API {${newApi.code}}을 Super Admin 역할에 권한 추가`,
      SYNC_SERVICE,
    );
  }
  return newApi.id;
};
/**
 * DB에 API 업데이트
 * @type {(api: import("@prisma/client").Api) => number}
 */
const updateApi = async (api, idx) => {
  const updatedApi = await prisma.api.update({
    where: { code: api.code },
    data: { ...api, updatedBy: authors[idx] },
  });
  Logger.log(`기존 Api DB에 업데이트. {${updatedApi.code}}`, SYNC_SERVICE);
  return updatedApi.id;
};
/**
 * DB에 API 삭제
 * @type {(api: import("@prisma/client").Api) => number}
 */
const deleteApi = async (api) => {
  const deletedApi = await prisma.api.delete({
    where: { code: api.code },
  });
  Logger.log(`기존 Api DB에 삭제. {${deletedApi.code}}`, SYNC_SERVICE);
  // const deletedApi = await prisma.api.update({
  //   where: { code: api.code },
  //   data: {
  //     ...api,
  //     deletedAt: new Date(),
  //     deletedBy: SCRIPT_USER,
  //   },
  // });
  // return deletedApi.id;
};

/**
 * 괄호 안 텍스트 추출
 * @param {string} text
 * @returns {string}
 */
const extractTextFromParenthesis = (text) => {
  const result = text.match(/\(([^)]+)\)/g);
  if (!result) return '';
  return result[0].replace(/\(/g, '').replace(/\)/g, '').replace(/\'/g, '');
};

/**
 * `@Controller` 이름 추출 함수
 * @param {string} code
 * @returns {string} controller base name
 */
const parseControllerName = (code) => {
  const controller = code.match(/@Controller\((\'.+\'|)\)/g)[0];
  return extractTextFromParenthesis(controller);
};

/**
 * 라인 번호 추출 함수
 */
const getLineNumberMatch = (originalCode, regex) => {
  const splittedCode = originalCode.split('\n');
  const matchedLines = splittedCode.reduce((result, line, idx) => {
    const matchingLine = line.match(regex);
    if (!matchingLine) return result;
    result.push({
      matchingLine: matchingLine[0],
      lineNo: idx + 1,
    });
    return result;
  }, []);
  return matchedLines;
};

/**
 * `@Get()`, `@Post()` 등 메소드 추출 함수
 * @param {{method: string, name: string}} code
 */
const parseMethods = (code) => {
  const methodsRegex = /@(Get|Post|Put|Patch|Delete)\((\'.+\'|)\)/g;
  const matchedLines = getLineNumberMatch(code, methodsRegex);

  return matchedLines.map(({ matchingLine, lineNo }) => ({
    method: matchingLine.split('(')[0].replace('@', ''),
    name: extractTextFromParenthesis(matchingLine),
    lineNo,
  }));
};

const init = async () => {
  // 애플리케이션 추가
  const appId = await upsertApp();

  // SRC 경로
  const srcDir = join(process.cwd(), 'src');

  // Glob 패턴으로 controller 파일 목록 조회
  const controllerFiles = globSync('**/*controller.ts', {
    cwd: srcDir,
    ignore: ['node_modules'],
  });

  /**
   * 파일에 선언된 API 목록
   * @type {import('@prisma/client').Api[]}
   */
  const declaredApis = [];
  // controller 파일에서 메소드, API 엔드포인트 추출
  for (let i = 0; i < controllerFiles.length; i++) {
    const controllerFilename = controllerFiles[i];
    const code = readFileSync(join(srcDir, controllerFilename), {
      encoding: 'utf-8',
    }).toString();
    const controllerName = parseControllerName(code);
    const methods = parseMethods(code);
    methods.forEach(async ({ method, name, lineNo }) => {
      const endpoint = `/${controllerName}/${name}`.replaceAll('//', '/');
      // 마지막 슬래시 제거
      const parsedEndpoint = endpoint.endsWith('/')
        ? endpoint.slice(0, -1)
        : endpoint;

      declaredApis.push({
        code: `${APP_NAME}::${method.toUpperCase()}:${parsedEndpoint}`,
        method,
        endpoint,
        sourceFile: controllerFilename,
      });
      const gitUser = await getScriptUser(controllerFilename, lineNo);
      authors.push(gitUser);
    });
  }

  // DB에 선언된 API 목록
  const databaseApis = await getDbApis(appId);
  // 변동이 없는 API 목록
  const unchangedApis = _.intersectionWith(
    databaseApis,
    declaredApis,
    _.isEqual,
  );
  // 삭제된 API 목록
  const deletedApis = _.differenceWith(databaseApis, declaredApis, _.isEqual);
  // 신규 생성된 API 목록
  const newApis = _.differenceWith(
    declaredApis,
    databaseApis,
    (declaredApi, dbApi) => declaredApi.code === dbApi.code,
  );
  // 업데이트된 API 목록
  const updatedApis = _.differenceWith(
    declaredApis,
    unchangedApis.concat(newApis),
    _.isEqual,
  );

  // 신규 API 추가
  for (let j = 0; j < newApis.length; j++) {
    await createApi(appId, newApis[j], j);
  }
  // API 삭제
  for (let k = 0; k < deletedApis.length; k++) {
    await deleteApi(deletedApis[k]);
  }
  // API 업데이트
  for (let l = 0; l < updatedApis.length; l++) {
    await updateApi(updatedApis[l], l);
  }
};

init();
prisma.$disconnect();
