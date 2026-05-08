import { ReactNode, useState, useEffect } from 'react';
import { useRBAC } from '@/hooks/useRBAC';
import { UserRole } from '@/types/auth';

interface CanProps {
  roles: UserRole | UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function Can({ roles, children, fallback = null }: CanProps) {
  const { hasRole } = useRBAC();
  const [mounted, setMounted] = useState(false);

  // Wait for hydration to complete
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!hasRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
