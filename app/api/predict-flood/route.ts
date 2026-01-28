import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const ML_API_URL = process.env.ML_API_URL || 'http://127.0.0.1:8000'; // Default to local FastAPI URL

  try {
    const requestBody = await request.json();

    // Forward the request to the ML API
    const mlApiResponse = await fetch(`${ML_API_URL}/predict/flood-potential-xgb`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!mlApiResponse.ok) {
      const errorData = await mlApiResponse.json();
      console.error('Error from ML service:', errorData);
      return NextResponse.json(
        { message: errorData.detail || 'Failed to get prediction from ML service', details: errorData },
        { status: mlApiResponse.status }
      );
    }

    const predictionData = await mlApiResponse.json();
    return NextResponse.json(predictionData);
  } catch (error: any) {
    console.error('Internal server error:', error);
    return NextResponse.json({ message: 'An internal server error occurred in the Next.js server', details: error.message }, { status: 500 });
  }
}