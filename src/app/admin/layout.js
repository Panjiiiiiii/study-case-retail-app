"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import NavbarSidebar from "./components/navbar";

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      console.log('🔍 No session found, redirecting to home page');
      window.location.href = '/';
      return;
    }

    if (session.user.role !== 'ADMIN') {
      console.log('🔍 User is not admin, redirecting to home page');
      window.location.href = '/';
      return;
    }

    console.log('🔍 Admin access granted for:', session.user.email);
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-950 mx-auto"></div>
          <p className="mt-4 text-sky-950">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="text-center">
          <p className="text-sky-950">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavbarSidebar />
      <main className="flex-1 bg-gray-200 ml-[100px] min-h-screen relative">
        {children}
      </main>
    </>
  );
}