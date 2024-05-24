// components/ProtectedRoute.tsx
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/app/lib/auth';
import { ROUTES } from '@/app/lib/constants';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const currentUser = useAuth();

  useEffect(() => {
    if (!currentUser) {
      router.push(ROUTES.LOGIN.ROUTE); // Redirect to login if not authenticated
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return <div>Loading...</div>; // Show loading state while checking authentication
  }

  return <>{children}</>;
};

export default ProtectedRoute;
