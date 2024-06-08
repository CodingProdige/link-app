// pages/api/logout.ts
import { serialize } from 'cookie';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Unset the token cookie
  const cookie = serialize('token', '', {
    httpOnly: true,
    secure: 'production',
    maxAge: -1,
    path: '/',
  });

  const headers = new Headers();
  headers.append('Set-Cookie', cookie);

  return new Response(JSON.stringify({ message: 'Logout successful' }), {
    status: 200,
    headers: headers,
  });
}
