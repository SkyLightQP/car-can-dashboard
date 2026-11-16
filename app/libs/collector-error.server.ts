import { TRPCClientError } from '@trpc/client';

import type { AppRouter } from '@/types/collector';

const errorMessageByCode: Record<string, string> = {
  BAD_REQUEST: '입력값을 확인해 주세요.',
  NOT_FOUND: '이미 삭제되었거나 없는 항목입니다.',
  UNAUTHORIZED: '로그인이 만료되었습니다. 다시 로그인해 주세요.',
};

const CONNECTION_ERROR_MESSAGE = '수집 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.';

export function toCollectorErrorMessage(error: unknown): string {
  if (!(error instanceof TRPCClientError)) throw error;
  const code = (error as TRPCClientError<AppRouter>).data?.code;
  return (code && errorMessageByCode[code]) ?? CONNECTION_ERROR_MESSAGE;
}
