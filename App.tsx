
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  AlertTriangle, 
  ChevronRight, 
  Loader2, 
  Activity,
  Database
} from 'lucide-react';
import { MOCK_SPRINT, MOCK_METRICS } from './constants';
import { ViewType, RiskAnalysis, SprintData, DeliveryMetrics } from './types';
import { analyzeSprintRisks } from './services/geminiService';
import DashboardView from './components/DashboardView';
import AnalyticsView from './components/AnalyticsView';
import RiskReportView from './components/RiskReportView';
import DataInputView from './components/DataInputView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('Dashboard');
  const [sprint, setSprint] = useState<SprintData>(MOCK_SPRINT);
  const [metrics, setMetrics] = useState<DeliveryMetrics>(MOCK_METRICS);
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const performAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const result = await analyzeSprintRisks(sprint, metrics);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sprint, metrics]);

  useEffect(() => {
    performAnalysis();
  }, [performAnalysis]);

  const navItems = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'Analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'RiskReport', icon: AlertTriangle, label: 'Risk Report' },
    { id: 'Input', icon: Database, label: 'Update Data' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-[#111827]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Activity className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-indigo-900">ScrumMate AI</h1>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ViewType)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeView === item.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-gray-100">
          <div className="bg-indigo-900 rounded-xl p-4 text-white">
            <p className="text-xs font-semibold text-indigo-300 uppercase mb-1">Current Sprint</p>
            <p className="text-sm font-bold truncate">{sprint.name}</p>
            <div className="mt-2 w-full bg-indigo-800 rounded-full h-1.5">
              <div 
                className="bg-indigo-400 h-1.5 rounded-full" 
                style={{ width: `${(sprint.completedPoints / sprint.plannedPoints) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">{activeView}</h2>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{sprint.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={performAnalysis}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
              Refresh Analysis
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeView === 'Dashboard' && (
            <DashboardView 
              sprint={sprint} 
              metrics={metrics} 
              analysis={analysis} 
              loading={loading}
            />
          )}
          {activeView === 'Analytics' && (
            <AnalyticsView metrics={metrics} />
          )}
          {activeView === 'RiskReport' && (
            <RiskReportView analysis={analysis} loading={loading} />
          )}
          {activeView === 'Input' && (
            <DataInputView 
              sprint={sprint} 
              metrics={metrics} 
              onUpdate={(newSprint, newMetrics) => {
                setSprint(newSprint);
                setMetrics(newMetrics);
                setActiveView('Dashboard');
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
