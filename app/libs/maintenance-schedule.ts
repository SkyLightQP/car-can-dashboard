import type { MaintenanceAlert, MaintenanceRecord, StatusLevel } from '@/types/dashboard';

interface ServiceRule {
  id: string;
  /** 알림에 표시할 이름 */
  item: string;
  /** 이력 항목 문자열에 이 중 하나가 포함되면 이 규칙에 묶인다 */
  keywords: string[];
  /** 교체·점검 주기 (km) */
  intervalKm: number;
  /** 남은 거리가 이 값 이하면 '주의' */
  warningKm: number;
}

const serviceRules: ServiceRule[] = [
  {
    id: 'engine-oil',
    item: '엔진오일 교환',
    keywords: ['엔진오일', '엔진 오일'],
    intervalKm: 10000,
    warningKm: 1500,
  },
  {
    id: 'brake-pad',
    item: '브레이크 패드 점검',
    keywords: ['브레이크'],
    intervalKm: 20000,
    warningKm: 3000,
  },
  {
    id: 'tire-rotation',
    item: '타이어 위치 교환',
    keywords: ['타이어 위치', '위치 교환'],
    intervalKm: 10000,
    warningKm: 1500,
  },
  {
    id: 'cabin-filter',
    item: '에어컨 필터 교체',
    keywords: ['에어컨', '실내 필터', '캐빈 필터'],
    intervalKm: 15000,
    warningKm: 2000,
  },
];

/** 규칙에 매칭되는 기록 중 주행거리가 가장 큰 것(=가장 최근 정비)을 고른다. */
function findLatestRecord(records: MaintenanceRecord[], rule: ServiceRule): MaintenanceRecord | undefined {
  return records
    .filter((record) => rule.keywords.some((keyword) => record.item.includes(keyword)))
    .reduce<MaintenanceRecord | undefined>((latest, record) => {
      if (!latest) return record;
      return record.odometerKm > latest.odometerKm ? record : latest;
    }, undefined);
}

function toStatus(remainingKm: number, warningKm: number): StatusLevel {
  if (remainingKm < 0) return 'critical';
  if (remainingKm <= warningKm) return 'warning';
  return 'normal';
}

/**
 * 정비 이력과 현재 주행거리로 알림을 계산한다.
 *
 * 알림은 저장되는 데이터가 아니라 이력에서 매번 파생되는 값이다.
 * 그래서 사용자가 '엔진오일 교환' 기록을 추가하면 해당 알림이 곧바로 갱신된다.
 */
export function deriveMaintenanceAlerts(records: MaintenanceRecord[], currentOdometerKm: number): MaintenanceAlert[] {
  return serviceRules.map((rule) => {
    const latest = findLatestRecord(records, rule);

    if (!latest) {
      return {
        id: rule.id,
        item: rule.item,
        dueDescription: `정비 이력 없음 · 주기 ${rule.intervalKm.toLocaleString('ko-KR')}km`,
        status: 'warning',
      };
    }

    const dueAtKm = latest.odometerKm + rule.intervalKm;
    const remainingKm = dueAtKm - currentOdometerKm;
    const status = toStatus(remainingKm, rule.warningKm);

    return {
      id: rule.id,
      item: rule.item,
      dueDescription:
        remainingKm < 0
          ? `권장 주기 ${Math.abs(remainingKm).toLocaleString('ko-KR')}km 초과`
          : `${remainingKm.toLocaleString('ko-KR')}km 남음`,
      status,
    };
  });
}
