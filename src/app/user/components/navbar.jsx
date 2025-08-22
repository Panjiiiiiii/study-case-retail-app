"use client";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { FaCartShopping, FaUser } from "react-icons/fa6";
import { LuArrowDownUp } from "react-icons/lu";
import { IoLogOut } from "react-icons/io5";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const navItems = [
  { icon: <AiFillHome className="text-[28px]" />, label: "Home", href: "/user/" },
  { icon: <FaCartShopping className="text-[28px]" />, label: "Payment", href: "#" },
  { icon: <LuArrowDownUp className="text-[28px]" />, label: "History", href: "/user/history" },
];

export default function NavbarSidebar({ onToggleCart }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logout berhasil!");
      router.push("/auth/signin");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Terjadi kesalahan saat logout");
    }
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-[100px] bg-white flex flex-col items-center justify-between py-4 shadow-md">
      
      {/* User Info (Top Icon) */}
      <div className="mt-8 p-4 rounded-md flex flex-col items-center gap-1">
        <div className="text-orange-600">
          <FaUser className="text-[28px]" />
        </div>
        <span className="text-orange-600 text-sm text-center">
          {session?.user?.name || 'Cashier'}
        </span>
      </div>

      {/* Main Menu */}
      <div className="flex flex-col gap-6">
        {navItems.map((item, index) => {
          if (item.label === "Payment") {
            return (
              <button
                key={index}
                onClick={onToggleCart}
                title={item.label}
                className="group p-4 w-full rounded-md hover:bg-orange-600 transition-colors flex flex-col items-center gap-1"
              >
                <div className="text-orange-600 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <span className="text-orange-600 group-hover:text-white text-sm transition-colors">
                  {item.label}
                </span>
              </button>
            );
          }
          return (
            <Link href={item.href} key={index} title={item.label}>
              <div className="group p-4 w-full rounded-md hover:bg-orange-600 transition-colors flex flex-col items-center gap-1">
                <div className="text-orange-600 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <span className="text-orange-600 group-hover:text-white text-sm transition-colors">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Logout (Bottom Icon) */}
      <button 
        onClick={handleLogout}
        title="Logout"
        className="group mb-8 p-4 rounded-md hover:bg-orange-600 transition-colors flex flex-col items-center gap-1"
      >
        <div className="text-orange-600 group-hover:text-white transition-colors">
          <IoLogOut className="text-[28px]" />
        </div>
        <span className="text-orange-600 group-hover:text-white text-sm transition-colors">
          Logout
        </span>
      </button>
    </aside>
  );
}
