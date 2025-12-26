
import { SprintData, DeliveryMetrics } from './types';

export const MOCK_SPRINT: SprintData = {
  id: 'S-42',
  name: 'Sprint 42: Core API Optimization',
  startDate: '2024-05-01',
  endDate: '2024-05-14',
  plannedPoints: 85,
  completedPoints: 42,
  totalTasks: 24,
  completedTasks: 11
};

const generateTimeData = (base: number, volatility: number, length: number = 14) => {
  return Array.from({ length }, (_, i) => ({
    date: `May ${i + 1}`,
    value: Math.max(0, base + (Math.random() - 0.5) * volatility)
  }));
};

export const MOCK_METRICS: DeliveryMetrics = {
  prVelocity: generateTimeData(5, 4),
  codeChurn: generateTimeData(15, 10),
  bugReopenRate: generateTimeData(8, 6),
  cycleTime: generateTimeData(24, 12)
};
