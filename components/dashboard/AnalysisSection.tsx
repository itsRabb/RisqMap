import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

// Define interfaces for the data types (should match backend API and types/index.ts)
interface FloodEvent {
  id: string;
  location: string;
  timestamp: string;
  severity: 'Light' | 'Moderate' | 'Severe';
  durationHours: number;
  affectedAreaSqKm: number;
  causes: string[];
  damageEstimateUSD?: number;
  reportsCount: number;
  status: 'Completed' | 'Ongoing';
}

interface WeatherData {
  location: string;
  timestamp: string;
  temperatureC: number;
  humidity: number;
  precipitationMm: number;
  windSpeedKph: number;
  airQualityIndex?: number;
  pressureHpa?: number;
}

interface InfrastructureData {
  location: string;
  type: 'Pump Station' | 'River' | 'Drainage Channel';
  name: string;
  capacityCubicMeter?: number;
  lastMaintenanceDate?: string;
  condition: 'Good' | 'Needs Repair' | 'Damaged';
  historicalWaterLevelsMeters?: { timestamp: string; level: number }[];
  floodProneAreas?: string[];
}

// Define the expected structure of the JSON response from the API
interface AnalysisResponse {
  summary: string;
  keyTrends: string[];
  riskFactors: string[];
  recommendations: string[];
}

interface AnalysisSectionProps {
  floodEvents: FloodEvent[];
  weatherData: WeatherData[];
  infrastructureData: InfrastructureData[];
}

export function AnalysisSection({
  floodEvents,
  weatherData,
  infrastructureData,
}: AnalysisSectionProps) {
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          floodEvents: floodEvents,
          weatherData: weatherData,
          infrastructureData: infrastructureData,
          userPrompt: userPrompt || "Analyze flood trends in a major coastal city (e.g., New York) over the past 2 years and provide recommendations to mitigate impacts.", // Default prompt if empty
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch analysis results');
      }

      const data: AnalysisResponse = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Historical Flood Analysis with AI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid w-full gap-2">
          <Label htmlFor="user-prompt">Your Analysis Question:</Label>
          <Textarea
            id="user-prompt"
            placeholder="Example: Analyze flood trends in a major coastal city (e.g., New York) over the past 2 years and provide recommendations."
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            rows={4}
          />
          <Button onClick={handleAnalyze} disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
            ) : (
              'Start Analysis'
            )}
          </Button>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            <p>Error: {error}</p>
            <p>Make sure your GOOGLE_API_KEY is correct in .env.local and the API key has access to the Gemini 1.5 Pro model.</p>
          </div>
        )}

        {analysisResult && (
          <div className="space-y-4">
            <Separator />
            <h3 className="text-lg font-semibold">Analysis Results:</h3>
            
            <div>
              <h4 className="font-medium">Summary:</h4>
              <p className="text-sm text-muted-foreground">{analysisResult.summary}</p>
            </div>

            <div>
              <h4 className="font-medium">Key Trends:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {analysisResult.keyTrends.map((trend, index) => (
                  <li key={index}>{trend}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Risk Factors:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {analysisResult.riskFactors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Mitigation Recommendations:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

