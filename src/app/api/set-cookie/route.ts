import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  const maxAge = process.env.COOKIE_AGE || '3600'; // Default to 1 hour

  return new NextResponse(null, {
    headers: {
      'Set-Cookie': `token=${token}; Max-Age=${maxAge}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Path=/`,
    },
  });
}
