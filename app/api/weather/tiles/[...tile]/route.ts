import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: {
    tile: string[];
  };
}

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  // Weather tile proxy disabled — legacy raster tile providers are not used in this project.
  return new Response('Weather tile proxy disabled: no legacy raster tile provider integration.', { status: 404 });
}
