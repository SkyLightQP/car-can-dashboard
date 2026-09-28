const KST_OFFSET_MINUTES = 9 * 60;
const DAY_MS = 24 * 60 * 60 * 1000;

export function kstDateRangeEndingToday(days: number): { from: string; to: string } {
  const todayKst = new Date(Date.now() + KST_OFFSET_MINUTES * 60_000);
  const firstDayKst = new Date(todayKst.getTime() - (days - 1) * DAY_MS);

  return { from: firstDayKst.toISOString().slice(0, 10), to: todayKst.toISOString().slice(0, 10) };
}

/**
 * ISO 문자열을 한국 시간 기준의 고정 형식으로 만든다.
 *
 * toLocaleString 은 쓰지 않는다. Node 와 브라우저의 ICU 구현이 ko-KR 의
 * 오전/오후 표기를 다르게 내서(서버 'PM', 클라이언트 '오후') SSR 하이드레이션
 * 불일치를 일으키기 때문이다. getUTC* 로만 조립해 환경 차이가 개입할 여지를 없앤다.
 */
export function formatKstDateTime(iso: string): string {
  const time = new Date(iso).getTime();

  if (Number.isNaN(time)) {
    return '';
  }

  const shifted = new Date(time + KST_OFFSET_MINUTES * 60_000);
  const year = shifted.getUTCFullYear();
  const month = shifted.getUTCMonth() + 1;
  const day = shifted.getUTCDate();
  const hour = String(shifted.getUTCHours()).padStart(2, '0');
  const minute = String(shifted.getUTCMinutes()).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일 ${hour}:${minute}`;
}

/** 날짜만 필요한 자리(페이지 헤더의 기준일 등)에서 쓰는 짧은 형식. */
export function formatKstDate(iso: string): string {
  const formatted = formatKstDateTime(iso);
  return formatted ? formatted.replace(/ \d{2}:\d{2}$/, '') : '';
}
