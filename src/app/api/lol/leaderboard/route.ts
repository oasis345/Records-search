import { NextRequest, NextResponse } from 'next/server';
import { LOLService, lolService } from '@/app/services/lol.service';
import { gameServiceManager } from '@/app/services/serviceManager';

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get('region')!;
  const tier = request.nextUrl.searchParams.get('tier')!;
  const service = gameServiceManager.getService<LOLService>('lol');

  try {
    const result = await service.getLeaderBoard({ region, tier });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: error.statusCode ?? 500 });
  }
}
