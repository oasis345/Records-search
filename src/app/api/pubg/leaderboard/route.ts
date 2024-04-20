import { NextRequest, NextResponse } from 'next/server';
import { gameServiceManager } from '@/app/services/serviceManager';
import { PubgService } from '@/app/services/pubg.service';

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get('region')!;
  const gameMode = request.nextUrl.searchParams.get('gameMode')!;
  const service = gameServiceManager.getService<PubgService>('pubg');

  try {
    const result = await service.getLeaderBoard({ region, gameMode });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: error.statusCode ?? 500 });
  }
}
