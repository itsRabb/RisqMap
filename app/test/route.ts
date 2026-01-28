import { NextResponse } from 'next/server';

export async function GET() {
  console.log('DEBUG: Test API route hit! (RisqMap Project)'); // Add identification
  return NextResponse.json({
    message: 'Hello from Test API! (RisqMap Project)',
  });
}
