import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return new NextResponse(null, {
    headers: {
      'Set-Cookie': `token=; Max-Age=0; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Path=/`,
    },
  });
}
