import { NextRequest, NextResponse } from 'next/server';
import { tftService } from '@/app/services/tft.service';

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get('region')!;
  const name = request.nextUrl.searchParams.get('name')!;

  try {
    const result = await tftService.getSummoner({ region, name });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: error.statusCode ?? 500 });
  }
}
