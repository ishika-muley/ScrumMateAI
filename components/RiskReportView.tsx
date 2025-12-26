
import React from 'react';
import { RiskAnalysis } from '../types';
import { 
  ShieldAlert, 
  Target, 
  Lightbulb, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface Props {
  analysis: RiskAnalysis | null;
  loading: boolean;
}

const RiskReportView: React.FC<Props> = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <h3 className="text-xl font-bold text-gray-900">Generating Intelligence Report</h3>
        <p className="text-gray-500 mt-2 max-w-md">Gemini is correlating PR velocity with bug reopen rates to identify delivery risk zones...</p>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8">
           <div className={`text-4xl font-black ${
            analysis.riskScore > 70 ? 'text-red-600' : analysis.riskScore > 40 ? 'text-orange-500' : 'text-green-600'
           }`}>
             {analysis.riskScore}%
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-right">Risk Index</p>
           </div>
        </div>

        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Sprint Health Intelligence</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {analysis.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {analysis.predictedRiskZones.map((risk, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    risk.impact === 'High' ? 'bg-red-100 text-red-600' : 
                    risk.impact === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {risk.impact === 'High' ? <AlertTriangle className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                  </div>
                  <h3 className="font-bold text-gray-900">{risk.zone}</h3>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                  risk.impact === 'High' ? 'bg-red-200 text-red-800' :
                  risk.impact === 'Medium' ? 'bg-orange-200 text-orange-800' : 'bg-blue-200 text-blue-800'
                }`}>
                  {risk.impact} Impact
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Issue Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{risk.description}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Lightbulb className="w-3 h-3 text-amber-500" /> AI Strategy
                  </p>
                  <p className="text-sm text-gray-900 font-medium italic">"{risk.mitigationStrategy}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-indigo-900 rounded-2xl text-white flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-indigo-100">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Automated Risk Mitigation</h3>
            <p className="text-indigo-200 text-sm">Based on your current cycle time and bug reopen rates, ScrumMate AI suggests daily syncs focusing on QA bottlenecks for the next 48 hours.</p>
          </div>
          <button className="flex items-center gap-2 bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors whitespace-nowrap">
            Launch Action Plan <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskReportView;
