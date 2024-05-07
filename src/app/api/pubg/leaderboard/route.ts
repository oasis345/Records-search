import { NextRequest, NextResponse } from 'next/server';
import { pubgService } from '@/app/services/pubg.service';

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get('region')!;
  const gameMode = request.nextUrl.searchParams.get('gameMode')!;

  try {
    const result = await pubgService.getLeaderboard({ region, gameMode });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: error.statusCode ?? 500 });
  }
}
