"use client";
import { useState } from "react";
import NavbarSidebar from "./components/navbar"; // sesuaikan path-nya
import CartList from "./fragments/cart";

export default function Layout({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

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
