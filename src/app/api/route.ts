import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'src/app', 'riot.txt');
  const fileBuffer = await fs.readFileSync(filePath);

  const headers = new Headers();
  headers.set('Content-Type', 'text/plain');
  return new NextResponse(fileBuffer, { status: 200, statusText: 'OK', headers });
}
