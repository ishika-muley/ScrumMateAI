
export interface SprintData {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  plannedPoints: number;
  completedPoints: number;
  totalTasks: number;
  completedTasks: number;
}

export interface MetricPoint {
  date: string;
  value: number;
}

export interface DeliveryMetrics {
  prVelocity: MetricPoint[]; // PRs merged per day
  codeChurn: MetricPoint[];    // % of lines changed
  bugReopenRate: MetricPoint[]; // % reopened bugs
  cycleTime: MetricPoint[];    // Hours from commit to merge
}

export interface RiskAnalysis {
  overallHealth: 'Healthy' | 'At Risk' | 'Critical';
  riskScore: number; // 0-100
  predictedRiskZones: {
    zone: string;
    impact: 'Low' | 'Medium' | 'High';
    description: string;
    mitigationStrategy: string;
  }[];
  summary: string;
}

export type ViewType = 'Dashboard' | 'Analytics' | 'RiskReport' | 'Input';
