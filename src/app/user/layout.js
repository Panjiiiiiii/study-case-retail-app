"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavbarSidebar from "./components/navbar";
import CartList from "./fragments/cart";

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      console.log('🔍 No session found, redirecting to home page');
      window.location.href = '/';
      return;
    }

    if (session.user.role !== 'CASHIER') {
      console.log('🔍 User is not cashier, redirecting to home page');
      window.location.href = '/';
      return;
    }

    console.log('🔍 Cashier access granted for:', session.user.email);
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#EBE7E5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-orange-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'CASHIER') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#EBE7E5]">
        <div className="text-center">
          <p className="text-orange-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavbarSidebar onToggleCart={() => setIsCartOpen(!isCartOpen)} />

      <main className="flex-1 bg-[#EBE7E5] ml-[100px] min-h-screen relative">
        {children}

        {/* Cart aside */}
        {isCartOpen && (
          <div className="fixed top-0 right-0 z-50">
            <CartList />
          </div>
        )}
      </main>
    </>
  );
}
