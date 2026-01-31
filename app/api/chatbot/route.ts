// app/api/chatbot/route.ts

import { NextResponse } from 'next/server';
import {
  GoogleGenerativeAI,
  Tool,
  FunctionDeclaration,
  SchemaType,
  Content,
} from '@google/generative-ai';
import {
  WaterLevelPost,
  PumpData,
  EarthquakeData,
  DisasterReport,
  WeatherData,
  NominatimResult,
  FetchDisasterReportsArgs,
  FetchWeatherDataArgs,
  GeocodeLocationArgs,
  DisplayNotificationArgs,
} from '@/lib/api';
import {
  fetchWaterLevelData,
  fetchPumpStatusData,
  fetchUSGSLatestQuake,
  fetchDisasterReports,
  fetchWeatherData,
  geocodeLocation,
} from '@/lib/api.client';

// Initialize Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// No legacy raster tile provider API key used — Open‑Meteo is the primary provider.

// ===============================================
// FUNCTION/TOOL DEFINITIONS
// ===============================================

const tools: Tool[] = [
  {
    functionDeclarations: [
      { name: 'fetchWaterLevelData', description: 'Retrieves water surface level data from hydrological stations.', parameters: { type: SchemaType.OBJECT, properties: {}, required: [] } },
      { name: 'fetchPumpStatusData', description: 'Retrieves operational status of flood pumps.', parameters: { type: SchemaType.OBJECT, properties: {}, required: [] } },
      { name: 'fetchUSGSLatestQuake', description: 'Retrieves the latest earthquake information from USGS global earthquake feed.', parameters: { type: SchemaType.OBJECT, properties: {}, required: [] } },
      { name: 'requestUserLocation', description: 'Use if the user asks for location-based information without specifying a specific location (e.g., "around me").', parameters: { type: SchemaType.OBJECT, properties: {}, required: [] } },
      { name: 'fetchDisasterReports', description: 'Retrieves disaster reports from external sources (mapped to app schema).', parameters: { type: SchemaType.OBJECT, properties: { hazardType: { type: SchemaType.STRING, description: "Disaster type (flood, earthquake, etc)" }, timeframe: { type: SchemaType.STRING, description: "Time range (6h, 24h, 3d, etc)" } }, required: [] } },
      { name: 'geocodeLocation', description: 'Converts a location name into coordinates.', parameters: { type: SchemaType.OBJECT, properties: { query: { type: SchemaType.STRING, description: "Location name" } }, required: ['query'] } },
      { name: 'fetchWeatherData', description: "Retrieves current weather conditions.", parameters: { type: SchemaType.OBJECT, properties: { lat: { type: SchemaType.NUMBER }, lon: { type: SchemaType.NUMBER }, locationName: { type: SchemaType.STRING } }, required: [] } },
      { name: 'displayNotification', description: 'Displays a popup notification to the user.', parameters: { type: SchemaType.OBJECT, properties: { message: { type: SchemaType.STRING }, type: { type: SchemaType.STRING, format: 'enum', enum: ['success', 'error', 'warning', 'info', 'default'] }, duration: { type: SchemaType.NUMBER } }, required: ['message'] } },
    ],
  },
];

// ===============================================
// MAIN FUNCTIONS
// ===============================================

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function retry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      const status = e?.status ?? e?.response?.status;
      if ([429, 503].includes(status) && i < retries - 1) {
        console.warn(`[Chatbot API] Retrying due to status ${status}. Attempt ${i + 1}/${retries}...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * (i + 1)));
      } else {
        throw e;
      }
    }
  }
  throw new Error("Max retries reached");
}
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!genAI) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is missing' }, { status: 500 });
  }

  try {
    const { question, history, location } = await request.json();

    const isFunctionResponseTurn = history && history.length > 0 && history[history.length - 1].role === 'function';
    if (!question && !isFunctionResponseTurn) {
      return NextResponse.json({ error: 'Question is required.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      tools: tools,
      systemInstruction:
        `You are RisqMap's intelligent disaster monitoring assistant. You have access to REAL-TIME tools and MUST use them to answer user questions.

CRITICAL RULES:
1. **ALWAYS use tools** - Never say "I cannot help" or "I don't have access" - YOU HAVE THE TOOLS!
2. **Weather questions**: Use geocodeLocation (if location mentioned) → then fetchWeatherData
3. **Flood risk/water levels**: Use fetchWaterLevelData 
4. **Pump station status**: Use fetchPumpStatusData
5. **Evacuation/disaster reports**: Use fetchDisasterReports
6. **Earthquakes**: Use fetchUSGSLatestQuake
7. **Location-based ("around me", "near me")**: Use requestUserLocation FIRST

NEVER respond with:
- "I cannot retrieve..."
- "I don't have access to..."  
- "I'm unable to help with..."
- "I can't provide..."

INSTEAD:
- IMMEDIATELY call the appropriate tool
- Provide the data from the tool response
- Give actionable information

Example responses:
❌ BAD: "I cannot retrieve pump station data"
✅ GOOD: [Calls fetchPumpStatusData] "Here are the current pump stations: Station A is operational, Station B is offline..."

❌ BAD: "I'm unable to help with evacuation"  
✅ GOOD: [Calls fetchDisasterReports] "Current active disasters in your area: Flash flood warning in effect..."

You are EMPOWERED with real-time data tools. USE THEM!`,
    });

    const contents: Content[] = [...(history || [])];
    if (location) {
        contents.unshift({
            role: 'user',
            parts: [{ text: `Current location context: ${JSON.stringify(location)}` }]
        });
    }
    if (question) {
      contents.push({ role: 'user', parts: [{ text: question }] });
    }

    const result = await retry(() => model.generateContent({ contents }));
    const response = result.response;

    // Add this check for safety
    if (response.promptFeedback?.blockReason) {
      return NextResponse.json(
        {
          answer: `Sorry, your request was blocked because: ${response.promptFeedback.blockReason}. Please try rephrasing your question.`,
        },
        { status: 200 }
      );
    }

    const calls = response.functionCalls();
    const call = calls ? calls[0] : undefined;

    if (call) {
      console.log(`[Chatbot API] 🛠️ Gemini Suggested Function: ${call.name} with args:`, call.args);

      if (call.name === 'requestUserLocation') {
        return NextResponse.json({ action: 'REQUEST_LOCATION', originalCall: call }, { status: 200 });
      }
let toolResponseData: any;
      try {
        if (call.name === 'fetchWaterLevelData') toolResponseData = await fetchWaterLevelData();
        else if (call.name === 'fetchPumpStatusData') toolResponseData = await fetchPumpStatusData();
        else if (call.name === 'fetchUSGSLatestQuake') toolResponseData = await fetchUSGSLatestQuake();
        else if (call.name === 'fetchDisasterReports') {
          const args = call.args as FetchDisasterReportsArgs;
          toolResponseData = await fetchDisasterReports(args.hazardType, args.timeframe);
        } else if (call.name === 'geocodeLocation') {
          const args = call.args as GeocodeLocationArgs;
          const geocodeResults = await geocodeLocation(args.query);
          toolResponseData = geocodeResults?.[0] ?? { error: `Could not find coordinates for '${args.query}'.` };
        } else if (call.name === 'fetchWeatherData') {
          const args = call.args as FetchWeatherDataArgs;
          let lat = args.lat, lon = args.lon;
          if (!lat || !lon) {
            const locationName = args.locationName || 'New York, NY';
            const geocodeResults = await geocodeLocation(locationName);
            if (geocodeResults && geocodeResults.length > 0) {
              lat = parseFloat(geocodeResults[0].lat);
              lon = parseFloat(geocodeResults[0].lon);
            } else {
              lat = 40.7128; lon = -74.0060; // Fallback New York
            }
          }
          toolResponseData = await fetchWeatherData(lat, lon, '');
          if (args.locationName) toolResponseData.locationName = args.locationName;
        } else if (call.name === 'displayNotification') {
            const args = call.args as DisplayNotificationArgs;
            return NextResponse.json({ notification: { message: args.message, type: args.type, duration: args.duration } }, { status: 200 });
        } else {
          throw new Error(`Unknown function: ${call.name}`);
        }

        const toolContents: Content[] = [
          ...contents,
          { role: 'model', parts: [{ functionCall: call }] },
          { role: 'function', parts: [{ functionResponse: { name: call.name, response: toolResponseData } }] },
        ];

        const finalResult = await model.generateContent({ contents: toolContents });
        return NextResponse.json({ answer: finalResult.response.text() }, { status: 200 });

      } catch (toolExecutionError: any) {
        console.error(`[Chatbot API] ❌ Error executing tool '${call.name}':`, toolExecutionError);
        const errorContents: Content[] = [
          ...contents,
          { role: 'model', parts: [{ functionCall: call }] },
          { role: 'function', parts: [{ functionResponse: { name: call.name, response: { error: toolExecutionError.message } } }] },
        ];
        const errorResult = await model.generateContent({ contents: errorContents });
        return NextResponse.json({ answer: errorResult.response.text() }, { status: 200 });
      }
    } else {
      return NextResponse.json({ answer: response.text() }, { status: 200 });
    }
  } catch (error: any) {
    console.error('[Chatbot API] Fatal Error in POST handler:', error);
    const errorMessage = 'An unexpected internal server error occurred. Please try again later.';

    // Add detailed error message in development
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ 
        error: errorMessage, 
        message: errorMessage, 
        details: error.message, // Include the actual error message
        stack: error.stack      // Include the stack trace
      }, { status: 500 });
    }

    return NextResponse.json({ error: errorMessage, message: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Chatbot API (Flash) is running OK' }, { status: 200 });
}