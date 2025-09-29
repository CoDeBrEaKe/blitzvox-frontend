"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { checkAuth } from "@/redux/slices/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication status
    async function check() {
      try {
        await dispatch(checkAuth());
      } catch (e) {
        router.push("/login");
      } finally {
        setIsChecking(false);
      }
    }
    check();
  }, [dispatch]);
  useEffect(() => {
    if (!isChecking && !loading && !user) {
      router.push("/login");
    }
  }, [user, loading, isChecking]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Only render children if authenticated
  return user ? <>{children}</> : null;
}
