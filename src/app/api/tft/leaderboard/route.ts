import { NextRequest, NextResponse } from 'next/server';
import { tftService } from '@/app/services/tft.service';

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get('region')!;
  const tier = request.nextUrl.searchParams.get('tier')!;

  try {
    const result = await tftService.getLeaderBoard({ region, tier });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: error.statusCode });
  }
}
