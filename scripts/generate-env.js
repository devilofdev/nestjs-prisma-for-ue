#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

/**
 * `.env.development` 또는 `.env.production`파일을 읽어와
 * Prisma가 사용할 수 있는 DATABASE_URL을 생성하는 스크립트
 */
(async () => {
  try {
    // Dotenv 불러오기
    dotenv.config({
      path:
        process.env.NODE_ENV === 'dev' ? '.env.development' : '.env.production',
    });

    // 텍스트 생성
    const comment =
      '# This file was auto-generated. Please do not modify.\n# 해당 파일은 자동 생성되었습니다. 수정 금지.\n\n';
    const disableERD = `# ERD 생성 비활성화\nDISABLE_ERD=true\n`;
    const dbConnectionString = `DATABASE_URL="postgresql://${
      process.env.DB_USERNAME
    }:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${
      process.env.DB_PORT
    }/${process.env.DB_NAME ?? 'postgres'}?pgbouncer=true&connection_limit=1"\n`;
    
    const dbDirectString = `DIRECT_URL="postgresql://${
      process.env.DB_USERNAME
    }:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${
      process.env.DB_DIRECT_PORT
    }/${process.env.DB_NAME ?? 'postgres'}"`;

    // 신규 .env 파일 생성
    fs.writeFileSync(
      path.join(process.cwd(), '.env'),
      comment + disableERD + dbConnectionString + dbDirectString,
    );
  } catch (err) {
    console.error(err);
  }
})();
