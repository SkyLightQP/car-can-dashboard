import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { deriveMaintenanceAlerts } from '@/libs/maintenance-schedule';
import { initialMaintenanceRecords, mockCurrentOdometerKm } from '@/mocks/maintenance';
import type { MaintenanceAlert, MaintenanceRecord } from '@/types/dashboard';

export type NewMaintenanceRecord = Omit<MaintenanceRecord, 'id'>;

interface MaintenanceContextValue {
  records: MaintenanceRecord[];
  alerts: MaintenanceAlert[];
  addRecord: (record: NewMaintenanceRecord) => void;
}

const MaintenanceContext = createContext<MaintenanceContextValue | null>(null);

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<MaintenanceRecord[]>(initialMaintenanceRecords);

  const addRecord = useCallback((record: NewMaintenanceRecord) => {
    setRecords((previous) => [{ ...record, id: `mr-${Date.now()}` }, ...previous]);
  }, []);

  const alerts = useMemo(() => deriveMaintenanceAlerts(records, mockCurrentOdometerKm), [records]);

  const value = useMemo(() => ({ records, alerts, addRecord }), [records, alerts, addRecord]);

  return <MaintenanceContext value={value}>{children}</MaintenanceContext>;
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);

  if (!context) {
    throw new Error('useMaintenance는 MaintenanceProvider 안에서만 쓸 수 있습니다.');
  }

  return context;
}
