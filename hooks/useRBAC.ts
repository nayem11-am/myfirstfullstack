import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types/auth';

export const useRBAC = () => {
  const { user } = useAuthStore();

  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const isAdmin = () => hasRole('admin');
  const isMember = () => hasRole('member');

  return {
    user,
    hasRole,
    isAdmin,
    isMember,
    role: user?.role
  };
};
