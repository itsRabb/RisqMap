// mattyudha/risqmap/RisqMap-04cbe0509e23f883f290033cafa7f880e929fe65/app/api/gemini-alerts/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load API key from .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Debug log to ensure API key is loaded
console.log(
  '[Gemini API] Key Loaded:',
  GEMINI_API_KEY ? '✅ Yes' : '❌ Missing',
);

// Initialize AI instance
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!genAI) {
    console.error('[Gemini API] ❌ API key not found.');
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is missing in environment.' },
      { status: 500 },
    );
  }

  try {
    const rawBody = await request.text();
    console.log('[Gemini API] 📥 Raw Request Body:', rawBody);

    const body = JSON.parse(rawBody);
    const alertData = body?.alertData;

    if (!alertData) {
      console.warn("[Gemini API] ⚠️ 'alertData' missing in request.");
      return NextResponse.json(
        { error: "'alertData' is required in request body." },
        { status: 400 },
      );
    }

    const {
      level,
      location,
      timestamp,
      reason,
      affectedAreas,
      estimatedPopulation,
      severity,
      newsContent,
      historicalData, // New field for historical incident data
      userPrompt, // New field for user's specific prompt for analysis
      requestType,
    } = alertData;

    let prompt: string;
    let modelName = 'gemini-1.5-flash'; // Default model

    if (requestType === 'news_summary' && newsContent) {
      // Prompt for news summary
      prompt = `
    You are a news analyst expert in summarizing important information related to disasters.
    Provide a brief summary (maximum 3-5 important points in concise and clear English) of the following news.
    Focus on the core event, location, impact, and recommendations if any.

    News Title: ${reason}
    Source: ${location}
    Time: ${timestamp}
    News Content:
    ---
    ${newsContent}
    ---

    Summary:
    `;
    } else if (requestType === 'historical_analysis' && historicalData) {
      // Prompt for historical incident analysis
      prompt = `
    You are a data scientist and disaster analyst expert in identifying patterns and insights from historical data.
    Based on the following historical incident data, conduct an in-depth analysis and provide an important report or insights.

    Focus on the user's request: "${userPrompt}"

    Historical Incident Data:
    ---
    ${historicalData}
    ---

    In-depth Analysis (in English, formatted in markdown for readability):
    `;
    } else if (
      !level ||
      !location ||
      !timestamp ||
      !reason ||
      severity == null
    ) {
      // Original prompt for disaster analysis
      console.warn(
        '[Gemini API] ⚠️ Required fields missing for alert analysis.',
      );
      return NextResponse.json(
        {
          error: "Missing required fields in 'alertData'.",
          missing: {
            level: !level,
            location: !location,
            timestamp: !timestamp,
            reason: !reason,
            severity: severity == null,
          },
        },
        { status: 400 },
      );
    } else {
      // Original prompt for disaster analysis
      prompt = `
You are a professional Disaster Mitigation and Risk Analysis Specialist with expertise in crisis communication. Create a disaster warning report that is VERY ENGAGING, PROFESSIONAL, and STRUCTURED.
📊 DISASTER WARNING DATA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 Warning Level: ${level}
📍 Location: ${location}
⏰ Event Time: ${timestamp}
💡 Primary Cause: ${reason}
🏘️ Affected Area: ${
        affectedAreas?.length ? affectedAreas.join(', ') : 'Not known'
      }
👥 Population Estimate: ${
        estimatedPopulation?.toLocaleString('en-US') ?? 'Not known'
      } people
⚠️ Severity Level: ${severity}/10
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MANDATORY OUTPUT FORMAT:
Create a report with the following VERY ENGAGING and PROFESSIONAL format:

🔴 **DISASTER EXECUTIVE SUMMARY**
───────────────────────────────────────
[A brief yet impactful summary in 2-3 sentences that immediately explains the critical situation]

📈 **COMPREHENSIVE STATISTICAL ANALYSIS**
───────────────────────────────────────
• **Event Intensity**: [Provide specific data such as rainfall X mm/hour, wind speed Y km/hour, magnitude Z, etc.]
• **Historical Comparison**: [Compare with similar events in the last 5-10 years with percentages]
• **Impact Projection**: [Estimate affected area in km², number of at-risk buildings, economic losses]
• **Escalation Probability**: [Percentage chance of worsening within the next 6-24 hours]
• **Regional Risk Index**: [Score 1-100 based on area vulnerability]

🌍 **GEOGRAPHICAL & METEOROLOGICAL ANALYSIS**
───────────────────────────────────────
[Explain specific geographical conditions, topography, and meteorological factors influencing the event. Use accurate technical data]

⚡ **TIERED IMPACT SCENARIOS**
───────────────────────────────────────
🟡 **LIGHT SCENARIO (Probability: X%)**
   → Impact: [Describe minimal consequences]
   → Duration: [Time estimate]
   → Area: [Geographical reach]

🟠 **MODERATE SCENARIO (Probability: Y%)**
   → Impact: [Describe intermediate consequences]
   → Duration: [Time estimate]
   → Area: [Geographical reach]

🔴 **SEVERE SCENARIO (Probability: Z%)**
   → Impact: [Describe maximum consequences]
   → Duration: [Time estimate]
   → Area: [Geographical reach]

🛡️ **EMERGENCY RESPONSE PROTOCOL**
───────────────────────────────────────
**PHASE 1 - IMMEDIATE ACTIONS (0-2 hours)**
• [Concrete steps with specific timelines]
• [Evacuation routes with GPS coordinates if possible]
• [Priority emergency contacts]

**PHASE 2 - STABILIZATION (2-6 hours)**
• [Follow-up actions for security]
• [Coordination with authorities]
• [Preparation of basic needs]

**PHASE 3 - RECOVERY (6-24 hours)**
• [Evaluation and normalization steps]
• [Condition monitoring]
• [Initial recovery plan]

📱 **INTEGRATED MONITORING SYSTEM**
───────────────────────────────────────
• **Update Frequency**: [Every X minutes/hours]
• **Critical Indicators**: [Parameters that must be monitored]
• **Escalation Threshold**: [Values that trigger status elevation]
• **Communication Channels**: [Official platforms for updates]

🎯 **STRATEGIC RECOMMENDATIONS**
───────────────────────────────────────
[Provide specific recommendations based on disaster characteristics and area]

⚠️ **SPECIAL WARNINGS**
───────────────────────────────────────
[Highlight specific risks requiring extra attention]

IMPORTANT:
- Use realistic and specific numerical data
- Include percentages, time estimates, and concrete measurements
- Create a visual display with engaging emojis and formatting
- Use professional yet easy-to-understand language
- Ensure all information is actionable and practical
- Provide an appropriate sense of urgency without causing panic
    `.trim();
    }

    console.log(
      `[Gemini API] ✉️ Sending ${requestType === 'news_summary' ? 'NEWS SUMMARY' : requestType === 'historical_analysis' ? 'HISTORICAL ANALYSIS' : 'DISASTER ANALYSIS'} prompt to Gemini...`,
    );
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const explanation = await response.text();

    let statisticalData = {};
    if (
      requestType !== 'news_summary' &&
      requestType !== 'historical_analysis'
    ) {
      // Generate statistical data for dashboard only for alert analysis
      const generateStatisticalData = (alertData: any) => {
        const { severity, estimatedPopulation } = alertData; // Removed affectedAreas from destructuring as it's not always used directly here

        const baseImpact = severity * 0.1;
        const populationAtRisk = estimatedPopulation || 10000;

        return {
          overviewStats: {
            totalAlertsToday: Math.floor(Math.random() * 50) + 10,
            activeAlerts: Math.floor(Math.random() * 15) + 5,
            resolvedAlerts: Math.floor(Math.random() * 30) + 15,
            criticalAlerts:
              severity >= 7
                ? Math.floor(Math.random() * 8) + 2
                : Math.floor(Math.random() * 3),
          },
          impactAnalysis: {
            populationAtRisk: populationAtRisk,
            evacuationCenters: Math.floor(populationAtRisk / 2000) + 2,
            emergencyResponders: Math.floor(populationAtRisk / 1000) + 10,
            affectedInfrastructure: Math.floor(severity * 12) + 5,
          },
          riskDistribution: {
            highRisk: Math.floor(baseImpact * 100 * 0.3) + '%',
            mediumRisk: Math.floor(baseImpact * 100 * 0.4) + '%',
            lowRisk: Math.floor(baseImpact * 100 * 0.3) + '%',
          },
          timeSeriesData: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            riskLevel: Math.floor(Math.random() * severity) + 1,
            incidents: Math.floor(Math.random() * 10) + 1,
            responses: Math.floor(Math.random() * 8) + 1,
          })),
          departmentResponse: {
            fireDepart: {
              deployed: Math.floor(severity * 5) + 3,
              available: Math.floor(severity * 3) + 2,
              utilization: Math.floor(baseImpact * 80) + 20,
            },
            medicalTeam: {
              deployed: Math.floor(severity * 3) + 2,
              available: Math.floor(severity * 2) + 1,
              utilization: Math.floor(baseImpact * 70) + 15,
            },
            police: {
              deployed: Math.floor(severity * 4) + 2,
              available: Math.floor(severity * 2) + 1,
              utilization: Math.floor(baseImpact * 60) + 25,
            },
            volunteers: {
              deployed: Math.floor(severity * 8) + 5,
              available: Math.floor(severity * 5) + 3,
              utilization: Math.floor(baseImpact * 50) + 30,
            },
          },
          resourceAllocation:
            alertData?.affectedAreas?.map((area: string, index: number) => ({
              area: area,
              priority:
                severity >= 7 ? 'HIGH' : severity >= 4 ? 'MEDIUM' : 'LOW',
              resources: Math.floor(severity * 15) + 10,
              personnel: Math.floor(severity * 8) + 5,
              equipment: Math.floor(severity * 6) + 3,
              status:
                index % 3 === 0
                  ? 'ACTIVE'
                  : index % 3 === 1
                    ? 'STANDBY'
                    : 'DEPLOYED',
            })) || [],
          performanceMetrics: {
            responseTime: Math.floor(severity * 2) + 3 + ' minutes',
            resolutionRate: Math.floor(90 - severity * 3) + '%',
            publicSatisfaction: Math.floor(85 - severity * 2) + '%',
            resourceEfficiency: Math.floor(80 - severity * 1.5) + '%',
          },
        };
      };
      statisticalData = generateStatisticalData(alertData);
    }

    console.log(
      `[Gemini API] ✅ ${requestType === 'news_summary' ? 'NEWS SUMMARY' : requestType === 'historical_analysis' ? 'HISTORICAL ANALYSIS' : 'DISASTER ANALYSIS'} generated.`,
    );
    return NextResponse.json(
      {
        explanation,
        statistics: statisticalData, // This will be empty for news summaries and historical analysis
        metadata: {
          generatedAt: new Date().toISOString(),
          modelUsed: modelName,
          promptVersion:
            requestType === 'news_summary'
              ? 'news_summary_v1.0'
              : requestType === 'historical_analysis'
                ? 'historical_analysis_v1.0'
                : 'professional-v2.0',
          responseLength: explanation.length,
          alertLevel: level,
          severityScore: severity,
          includesStatistics:
            requestType !== 'news_summary' &&
            requestType !== 'historical_analysis',
          requestType: requestType,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('[Gemini API] ❌ Error:', error?.message);
    return NextResponse.json(
      {
        error: 'Failed to generate explanation.',
        message: error?.message || 'Unknown error',
        stack: error?.stack || null,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  console.log('[Gemini API] 🔎 Health check passed.');
  return NextResponse.json(
    { message: 'Gemini API (Flash) is running OK' },
    { status: 200 },
  );
}