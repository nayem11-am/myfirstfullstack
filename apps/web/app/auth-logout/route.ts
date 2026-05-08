import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Local Next.js API route to clear cookies.
 * This is more reliable than proxying logout to the backend
 * because it ensures cookies are deleted on the frontend domain (port 3000).
 */
export async function POST() {
  const cookieStore = await cookies();
  
  // Clear all auth cookies with explicit options to ensure deletion
  const options = { path: '/', maxAge: 0 };
  
  cookieStore.set('accessToken', '', options);
  cookieStore.set('refreshToken', '', options);
  cookieStore.set('dev_admin_session', '', options);
  
  return NextResponse.json({ 
    success: true, 
    message: 'Cookies cleared on frontend' 
  });
}

