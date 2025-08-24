"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { H1, P } from "@/components/ui/Text";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (session?.user) {
      // User is authenticated, redirect based on role
      if (session.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-950 mx-auto"></div>
          <P className="mt-4 text-sky-950">Loading...</P>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-orange-100">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <H1 className="text-6xl font-bold text-sky-950">
            ERP Retail App
          </H1>
          <P className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistem manajemen retail yang terintegrasi untuk mengelola produk, inventori, dan keuangan bisnis Anda
          </P>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => router.push("/auth/signin")}
            className="px-8 py-3 text-lg font-semibold rounded-3xl w-40"
          >
            Masuk
          </Button>
          <Button
            onClick={() => router.push("/auth/signup")}
            className="px-8 py-3 text-lg font-semibold rounded-3xl w-40 bg-transparent border-2 border-sky-950 text-sky-950 hover:bg-sky-950 hover:text-white"
          >
            Daftar
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sky-950 text-3xl mb-4">📦</div>
            <h3 className="font-semibold text-sky-950 mb-2">Manajemen Produk</h3>
            <p className="text-gray-600 text-sm">Kelola produk, kategori, dan inventori dengan mudah</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sky-950 text-3xl mb-4">💰</div>
            <h3 className="font-semibold text-sky-950 mb-2">Keuangan</h3>
            <p className="text-gray-600 text-sm">Monitor penjualan, profit, dan laporan keuangan</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sky-950 text-3xl mb-4">👥</div>
            <h3 className="font-semibold text-sky-950 mb-2">Multi User</h3>
            <p className="text-gray-600 text-sm">Sistem role Admin dan Cashier dengan akses berbeda</p>
          </div>
        </div>
      </div>
    </div>
  );
}
