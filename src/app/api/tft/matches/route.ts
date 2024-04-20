import { NextRequest, NextResponse } from 'next/server';
import { tftService } from '@/app/services/tft.service';

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get('region')!;
  const puuid = request.nextUrl.searchParams.get('puuid')!;
  const start = request.nextUrl.searchParams.get('start')!;

  try {
    const result = await tftService.getMatches({ puuid, region, start });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: error.statusCode ?? 500 });
  }
}
