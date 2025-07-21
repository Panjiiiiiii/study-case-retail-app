import NavbarSidebar from "./components/navbar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <NavbarSidebar />
      <main className="flex-1 bg-[#EBE7E5]">
        {children}
      </main>
    </div>
  );
}