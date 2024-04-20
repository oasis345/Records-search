import { NextRequest, NextResponse } from 'next/server';
import { TFTService, tftService } from '@/app/services/tft.service';
import { gameServiceManager } from '@/app/services/serviceManager';

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get('region')!;
  const name = request.nextUrl.searchParams.get('name')!;
  const service = gameServiceManager.getService<TFTService>('tft');

  try {
    const result = await service.findUser({ region, name });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: error.statusCode ?? 500 });
  }
}
