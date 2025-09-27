"use client";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const router = useRouter();
  useEffect(() => {
    if (user) {
      const redirectTo = "/clients";
      router.push(redirectTo);
    }
  }, [user, router]);
  return (
    <div className="bg-blue-100 flex items-center justify-center min-h-screen ">
      {children}
    </div>
  );
}
