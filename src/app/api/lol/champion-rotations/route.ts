import { NextRequest, NextResponse } from 'next/server';
import { LOLService, lolService } from '@/app/services/lol.service';
import { gameServiceManager } from '@/app/services/serviceManager';

export async function GET(request: NextRequest) {
  try {
    const service = gameServiceManager.getService<LOLService>('lol');
    const result = await service.getRotationChampions();

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: error.statusCode });
  }
}
