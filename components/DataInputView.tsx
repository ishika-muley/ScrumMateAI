
import React, { useState } from 'react';
import { SprintData, DeliveryMetrics, MetricPoint } from '../types';
import { Save, RefreshCcw, Info } from 'lucide-react';

interface Props {
  sprint: SprintData;
  metrics: DeliveryMetrics;
  onUpdate: (sprint: SprintData, metrics: DeliveryMetrics) => void;
}

const DataInputView: React.FC<Props> = ({ sprint, metrics, onUpdate }) => {
  const [localSprint, setLocalSprint] = useState<SprintData>(sprint);
  const [localMetrics, setLocalMetrics] = useState<DeliveryMetrics>(metrics);

  const handleSprintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSprint(prev => ({
      ...prev,
      [name]: name.includes('Points') || name.includes('Tasks') ? parseInt(value) || 0 : value
    }));
  };

  const handleMetricChange = (metricKey: keyof DeliveryMetrics, index: number, value: string) => {
    const numericValue = parseFloat(value) || 0;
    const updatedMetric = [...localMetrics[metricKey]];
    updatedMetric[index] = { ...updatedMetric[index], value: numericValue };
    setLocalMetrics(prev => ({
      ...prev,
      [metricKey]: updatedMetric
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(localSprint, localMetrics);
  };

  const renderMetricInput = (label: string, key: keyof DeliveryMetrics) => (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
      <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        {label}
        <div className="group relative">
          <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            Enter values for the last 14 days. Comma separated values or individual inputs.
          </div>
        </div>
      </h4>
      <div className="grid grid-cols-7 gap-2">
        {localMetrics[key].map((point, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 text-center">{point.date.replace('May ', '')}</span>
            <input
              type="number"
              step="0.1"
              value={point.value}
              onChange={(e) => handleMetricChange(key, idx, e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none text-center"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sprint Configuration</h2>
          <p className="text-gray-500 mt-1">Update the raw data feeds that power ScrumMate AI's risk predictions.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
        {/* Sprint Info Section */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Sprint Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sprint Name</label>
              <input
                type="text"
                name="name"
                value={localSprint.name}
                onChange={handleSprintChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. Sprint 42: Core API Optimization"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Planned Points</label>
                <input
                  type="number"
                  name="plannedPoints"
                  value={localSprint.plannedPoints}
                  onChange={handleSprintChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Completed Points</label>
                <input
                  type="number"
                  name="completedPoints"
                  value={localSprint.completedPoints}
                  onChange={handleSprintChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Metrics Section */}
        <section>
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className="text-lg font-bold text-gray-900">Delivery Metrics (Last 14 Days)</h3>
            <span className="text-xs text-indigo-600 font-medium">Auto-calculating trends...</span>
          </div>
          <div className="space-y-4">
            {renderMetricInput("PR Velocity (Daily Merges)", "prVelocity")}
            {renderMetricInput("Code Churn (%)", "codeChurn")}
            {renderMetricInput("Bug Reopen Rate (%)", "bugReopenRate")}
            {renderMetricInput("Cycle Time (Avg Hours)", "cycleTime")}
          </div>
        </section>

        <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              setLocalSprint(sprint);
              setLocalMetrics(metrics);
            }}
            className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" /> Reset
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save & Analyze
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataInputView;
