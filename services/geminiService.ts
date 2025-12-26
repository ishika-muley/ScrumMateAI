
import { GoogleGenAI, Type } from "@google/genai";
import { SprintData, DeliveryMetrics, RiskAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function analyzeSprintRisks(
  sprint: SprintData,
  metrics: DeliveryMetrics
): Promise<RiskAnalysis> {
  const prompt = `
    Analyze the following sprint delivery metrics and predict risk zones for a software project.
    
    Sprint Data:
    - Name: ${sprint.name}
    - Progress: ${sprint.completedPoints}/${sprint.plannedPoints} points done.
    - Tasks: ${sprint.completedTasks}/${sprint.totalTasks} completed.
    
    Metrics Trends (Last 14 days):
    - PR Velocity (Daily merges): ${JSON.stringify(metrics.prVelocity)}
    - Code Churn (% lines changed): ${JSON.stringify(metrics.codeChurn)}
    - Bug Reopen Rate (%): ${JSON.stringify(metrics.bugReopenRate)}
    - Cycle Time (Avg hours): ${JSON.stringify(metrics.cycleTime)}
    
    Identify potential bottlenecks like "Scope Creep", "Technical Debt", "QA Bottleneck", or "Review Delay".
    Provide specific mitigation strategies.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallHealth: { type: Type.STRING, enum: ['Healthy', 'At Risk', 'Critical'] },
            riskScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            predictedRiskZones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  zone: { type: Type.STRING },
                  impact: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                  description: { type: Type.STRING },
                  mitigationStrategy: { type: Type.STRING }
                },
                required: ['zone', 'impact', 'description', 'mitigationStrategy']
              }
            }
          },
          required: ['overallHealth', 'riskScore', 'summary', 'predictedRiskZones']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as RiskAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback if API fails
    return {
      overallHealth: 'At Risk',
      riskScore: 65,
      summary: "Analysis failed due to a technical error. Metrics suggest moderate churn.",
      predictedRiskZones: [{
        zone: "Data Unavailability",
        impact: "Medium",
        description: "AI analysis was unable to process the data stream.",
        mitigationStrategy: "Refresh metrics or check API connectivity."
      }]
    };
  }
}
