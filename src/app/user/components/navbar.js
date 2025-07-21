import { AiFillHome } from "react-icons/ai";
import { FaCartShopping } from "react-icons/fa6";
import { LuArrowDownUp } from "react-icons/lu";
import { FaUser } from "react-icons/fa6";
import Link from "next/link";

const navItems = [
    {icon: <AiFillHome/>, label: 'Home', href: '/' },
    {icon: <FaCartShopping/>, label: 'Payment', href: '/cart' },
    {icon: <LuArrowDownUp />,label: 'History', href: '/history' },
    {icon : <FaUser/>, label: 'Logout', href: '/logout' },
];

export default function NavbarSidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-[100px] bg-white flex flex-col items-center justify-between py-4 shadow-md">
        
      <div className="flex flex-col gap-6">
        {navItems.slice(0, -1).map((item, index) => (
          <Link href={item.href} key={index} title={item.label}>
            <div className="p-2 rounded-md hover:bg-gray-200 transition-colors">
              {item.icon}
            </div>
          </Link>
        ))}
      </div>
      <div>
        <Link href={navItems[3].href} title={navItems[3].label}>
          <div className="p-2 rounded-md hover:bg-gray-200 transition-colors">
            {navItems[3].icon}
          </div>
        </Link>
      </div>
    </aside>
  );
}
