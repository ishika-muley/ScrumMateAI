
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CheckCircle2, 
  Clock, 
  GitPullRequest, 
  Bug, 
  Code2,
  AlertCircle
} from 'lucide-react';
import { SprintData, DeliveryMetrics, RiskAnalysis } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';

interface Props {
  sprint: SprintData;
  metrics: DeliveryMetrics;
  analysis: RiskAnalysis | null;
  loading: boolean;
}

const StatCard: React.FC<{ 
  title: string; 
  value: string | number; 
  subtitle: string; 
  icon: React.ElementType; 
  color: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}> = ({ title, value, subtitle, icon: Icon, color, trend, trendValue }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-xl ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {trendValue}
        </div>
      )}
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <div className="flex items-baseline gap-2 mt-1">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      <span className="text-xs text-gray-400 font-normal">{subtitle}</span>
    </div>
  </div>
);

const DashboardView: React.FC<Props> = ({ sprint, metrics, analysis, loading }) => {
  const burndownData = [
    { day: 'Day 1', ideal: 85, actual: 85 },
    { day: 'Day 3', ideal: 73, actual: 80 },
    { day: 'Day 5', ideal: 61, actual: 72 },
    { day: 'Day 7', ideal: 49, actual: 60 },
    { day: 'Day 9', ideal: 37, actual: 42 },
    { day: 'Day 11', ideal: 25, actual: null },
    { day: 'Day 13', ideal: 13, actual: null },
    { day: 'Day 14', ideal: 0, actual: null },
  ];

  const healthColor = analysis?.overallHealth === 'Healthy' 
    ? 'text-green-600' 
    : analysis?.overallHealth === 'At Risk' 
      ? 'text-orange-500' 
      : 'text-red-600';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Risk Summary Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center gap-6 ${
        analysis?.overallHealth === 'Healthy' ? 'bg-green-50 border-green-200' :
        analysis?.overallHealth === 'At Risk' ? 'bg-orange-50 border-orange-200' :
        'bg-red-50 border-red-200'
      }`}>
        <div className={`p-4 rounded-full ${
          analysis?.overallHealth === 'Healthy' ? 'bg-green-100' :
          analysis?.overallHealth === 'At Risk' ? 'bg-orange-100' :
          'bg-red-100'
        }`}>
          <AlertCircle className={`w-8 h-8 ${healthColor}`} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-bold flex items-center gap-2 justify-center md:justify-start">
            Sprint Status: <span className={healthColor}>{analysis?.overallHealth || 'Analyzing...'}</span>
          </h2>
          <p className="text-gray-600 mt-1 max-w-2xl">
            {analysis?.summary || 'Scanning delivery signals for anomalies and bottlenecks...'}
          </p>
        </div>
        <div className="flex flex-col items-center px-8 border-l border-gray-200">
          <span className="text-4xl font-black text-gray-900">{analysis?.riskScore || '--'}</span>
          <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Risk Score</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="PR Velocity" 
          value="4.2" 
          subtitle="merges / day" 
          icon={GitPullRequest} 
          color="bg-blue-50 text-blue-600"
          trend="up"
          trendValue="12%"
        />
        <StatCard 
          title="Code Churn" 
          value="18%" 
          subtitle="volatility" 
          icon={Code2} 
          color="bg-purple-50 text-purple-600"
          trend="down"
          trendValue="5%"
        />
        <StatCard 
          title="Bug Reopen Rate" 
          value="7.5%" 
          subtitle="regression" 
          icon={Bug} 
          color="bg-amber-50 text-amber-600"
          trend="up"
          trendValue="2%"
        />
        <StatCard 
          title="Cycle Time" 
          value="22h" 
          subtitle="avg duration" 
          icon={Clock} 
          color="bg-emerald-50 text-emerald-600"
          trend="down"
          trendValue="4h"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Burndown Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Sprint Burndown</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                <span className="text-xs text-gray-500 font-medium">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-xs text-gray-500 font-medium">Ideal</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={burndownData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="ideal" stroke="#d1d5db" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                <Area type="monotone" dataKey="actual" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Risks */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Predicted Risk Zones</h3>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                  </div>
                </div>
              ))
            ) : analysis?.predictedRiskZones.slice(0, 3).map((zone, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-default border border-transparent hover:border-gray-100">
                <div className={`p-2 rounded-lg shrink-0 ${
                  zone.impact === 'High' ? 'bg-red-50 text-red-600' : 
                  zone.impact === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{zone.zone}</h4>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      zone.impact === 'High' ? 'bg-red-100 text-red-700' :
                      zone.impact === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {zone.impact}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{zone.description}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
            View Detailed Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
