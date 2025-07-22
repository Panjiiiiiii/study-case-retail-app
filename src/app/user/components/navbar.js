import { AiFillHome } from "react-icons/ai";
import { FaCartShopping, FaUser } from "react-icons/fa6";
import { LuArrowDownUp } from "react-icons/lu";
import { IoLogOut } from "react-icons/io5";
import Link from "next/link";

const navItems = [
  { icon: <AiFillHome className="text-[28px]" />, label: 'Home', href: '/' },
  { icon: <FaCartShopping className="text-[28px]" />, label: 'Payment', href: '/cart' },
  { icon: <LuArrowDownUp className="text-[28px]" />, label: 'History', href: '/history' },
  { icon: <IoLogOut className="text-[28px]" />, label: 'Logout', href: '/logout' },
  { icon: <FaUser className="text-[28px]" />, label: 'Cashier', href: '/user' },
];

export default function NavbarSidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-[100px] bg-white flex flex-col items-center justify-between py-4 shadow-md">
      
      {/* Cashier (Top Icon) */}
      <Link href={navItems[4].href} title={navItems[4].label}>
        <div className="group mt-8 p-4 rounded-md hover:bg-orange-600 transition-colors flex flex-col items-center gap-1">
          <div className="text-orange-600 group-hover:text-white transition-colors">
            {navItems[4].icon}
          </div>
          <span className="text-orange-600 group-hover:text-white text-sm transition-colors">
            {navItems[4].label}
          </span>
        </div>
      </Link>

      {/* Main Menu */}
      <div className="flex flex-col gap-6">
        {navItems.slice(0, -2).map((item, index) => (
          <Link href={item.href} key={index} title={item.label}>
            <div className="group p-4 rounded-md hover:bg-orange-600 transition-colors flex flex-col items-center gap-1">
              <div className="text-orange-600 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <span className="text-orange-600 group-hover:text-white text-sm transition-colors">
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Logout (Bottom Icon) */}
      <Link href={navItems[3].href} title={navItems[3].label}>
        <div className="group mb-8 p-4 rounded-md hover:bg-orange-600 transition-colors flex flex-col items-center gap-1">
          <div className="text-orange-600 group-hover:text-white transition-colors">
            {navItems[3].icon}
          </div>
          <span className="text-orange-600 group-hover:text-white text-sm transition-colors">
            {navItems[3].label}
          </span>
        </div>
      </Link>
    </aside>
  );
}
