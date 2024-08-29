import { InternalServerErrorException } from '@nestjs/common';
import { hash, compare} from 'bcrypt';
import { SALT_COUNT } from 'src/constants';

/**
 * 스트링을 해시값으로 변환
 * @param original - 원본 스트링
 */
export const hashPassword = async (original: string): Promise<string> => {
  try {
    return await hash(original, SALT_COUNT);
  } catch (err) {
    throw new InternalServerErrorException();
  }
};

/**
 * 해시값과 스트링을 비교
 * @param rawString 원본 스트링
 * @param hash 비교할 해시값
 */
export const comparePassword = async (
  rawString: string,
  hash: string,
): Promise<boolean> => {
  try {
    return await compare(rawString, hash);
  } catch (err) {
    throw new InternalServerErrorException();
  }
};
