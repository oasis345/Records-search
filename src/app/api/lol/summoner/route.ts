import { NextRequest, NextResponse } from 'next/server';
import { lolService } from '@/app/services/lol.service';

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get('region')!;
  const name = request.nextUrl.searchParams.get('name')!;

  try {
    const result = await lolService.getSummoner({ region, name });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: error.statusCode });
  }
}
