"use client";

import { AiFillHome } from "react-icons/ai";
import { FaCartShopping, FaSuitcase, FaUser } from "react-icons/fa6";
import { BsCurrencyDollar } from "react-icons/bs";
import { LuArrowDownUp } from "react-icons/lu";
import { IoLogOut } from "react-icons/io5";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const navItems = [
  { icon: <AiFillHome className="text-[28px]" />, label: 'Home', href: '/admin/' },
  { icon: <FaSuitcase className="text-[28px]" />, label: 'Product', href: '/admin/product' },
  { icon: <LuArrowDownUp className="text-[28px]" />, label: 'Logistic', href: '/admin/logistic' },
  { icon: <BsCurrencyDollar className="text-[28px]" />, label: 'Finance', href: '/admin/finance' },
];

export default function NavbarSidebar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logout berhasil!");
      router.push('/auth/signin');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Terjadi kesalahan saat logout");
    }
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-[100px] bg-white flex flex-col items-center justify-between py-4 shadow-md">
      
      {/* User Info (Top Icon) */}
      <div className="mt-8 p-4 rounded-md flex flex-col items-center gap-1">
        <div className="text-sky-950">
          <FaUser className="text-[28px]" />
        </div>
        <span className="text-sky-950 text-sm text-center">
          {session?.user?.name || 'Admin'}
        </span>
      </div>

      {/* Main Menu */}
      <div className="flex flex-col gap-6">
        {navItems.map((item, index) => (
          <Link href={item.href} key={index} title={item.label}>
            <div className="group p-4 rounded-md hover:bg-sky-950 transition-colors flex flex-col items-center gap-1">
              <div className="text-sky-950 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <span className="text-sky-950 group-hover:text-white text-sm transition-colors">
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Logout (Bottom Icon) */}
      <button 
        onClick={handleLogout}
        title="Logout"
        className="group mb-8 p-4 rounded-md hover:bg-sky-950 transition-colors flex flex-col items-center gap-1"
      >
        <div className="text-sky-950 group-hover:text-white transition-colors">
          <IoLogOut className="text-[28px]" />
        </div>
        <span className="text-sky-950 group-hover:text-white text-sm transition-colors">
          Logout
        </span>
      </button>
    </aside>
  );
}
