import { NextRequest, NextResponse } from 'next/server';
import { lolService } from '@/app/services/lol.service';

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get('region')!;
  const tier = request.nextUrl.searchParams.get('tier')!;

  try {
    const result = await lolService.getLeaderboard({ region, tier });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: error.statusCode ?? 500 });
  }
}
