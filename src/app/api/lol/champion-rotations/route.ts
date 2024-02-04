import { NextRequest, NextResponse } from 'next/server';
import { lolService } from '@/app/services/lol.service';

export async function GET(request: NextRequest) {
  try {
    const result = await lolService.getRotationChampions();

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: error.statusCode });
  }
}
