import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { User } from '@/types/auth';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || 'kankir102$$$suiiiiicr7pola!@#$%13243426gsadshydfhMagirpolasudanirpua3265%%%%%$#sacdgas????@@132764hdgdfaf'
);

/**
 * Server-side function to validate the session via JWT.
 * Decoupled from Supabase to support the custom Express backend.
 */
export async function getServerSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
      // 🛡️ Check for Dev Admin Session bypass
      const devAdminCookie = cookieStore.get('dev_admin_session')?.value;
      if (devAdminCookie === 'true') {
        return {
          id: 'fixed-admin-id',
          email: 'admin@saas.com',
          fullName: 'System Administrator',
          role: 'admin',
          workspaceId: 'main-workspace', // Fallback for dev mode
        };
      }
      return null;
    }

    // Verify JWT
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    if (!payload) return null;

    return {
      id: payload.id as string,
      email: payload.email as string,
      fullName: (payload.fullName as string) || 'User',
      role: (payload.role as any) || 'member',
      workspaceId: payload.workspaceId as string,
    };
  } catch (error) {
    // If token is expired or invalid, silently fail and return null
    // Next.js layout will handle redirect to login
    return null;
  }
}

