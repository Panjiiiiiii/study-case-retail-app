import { AiFillHome } from "react-icons/ai";
import { FaCartShopping, FaSuitcase, FaUser } from "react-icons/fa6";
import { BsCurrencyDollar } from "react-icons/bs";
import { LuArrowDownUp } from "react-icons/lu";
import { IoLogOut } from "react-icons/io5";
import Link from "next/link";

const navItems = [
  { icon: <AiFillHome className="text-[28px]" />, label: 'Home', href: '/admin/' },
  { icon: <FaSuitcase className="text-[28px]" />, label: 'Product', href: '/admin/product' },
  { icon: <LuArrowDownUp className="text-[28px]" />, label: 'Logistic', href: '/admin/logistic' },
  { icon: <BsCurrencyDollar className="text-[28px]" />, label: 'Finance', href: '/admin/finance' },
  { icon: <IoLogOut className="text-[28px]" />, label: 'Logout', href: '/admin/logout' },
  { icon: <FaUser className="text-[28px]" />, label: 'Cashier', href: '/admin/user' },
];

export default function NavbarSidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-[100px] bg-white flex flex-col items-center justify-between py-4 shadow-md">
      
      {/* Cashier (Top Icon) */}
      <Link href={navItems[4].href} title={navItems[4].label}>
        <div className="group mt-8 p-4 rounded-md hover:bg-sky-900 transition-colors flex flex-col items-center gap-1">
          <div className="text-sky-900 group-hover:text-white transition-colors">
            {navItems[5].icon}
          </div>
          <span className="text-sky-900 group-hover:text-white text-sm transition-colors">
            {navItems[5].label}
          </span>
        </div>
      </Link>

      {/* Main Menu */}
      <div className="flex flex-col gap-6">
        {navItems.slice(0, -2).map((item, index) => (
          <Link href={item.href} key={index} title={item.label}>
            <div className="group p-4 rounded-md hover:bg-sky-900 transition-colors flex flex-col items-center gap-1">
              <div className="text-sky-900 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <span className="text-sky-900 group-hover:text-white text-sm transition-colors">
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Logout (Bottom Icon) */}
      <Link href={navItems[3].href} title={navItems[3].label}>
        <div className="group mb-8 p-4 rounded-md hover:bg-sky-900 transition-colors flex flex-col items-center gap-1">
          <div className="text-sky-900 group-hover:text-white transition-colors">
            {navItems[4].icon}
          </div>
          <span className="text-sky-900 group-hover:text-white text-sm transition-colors">
            {navItems[4].label}
          </span>
        </div>
      </Link>
    </aside>
  );
}
