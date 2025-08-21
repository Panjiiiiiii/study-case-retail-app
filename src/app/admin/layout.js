import NavbarSidebar from "./components/navbar";

export default function Layout({ children }) {
  return (
    <>
      <NavbarSidebar />
      <main className="flex-1 bg-gray-200 ml-[100px] min-h-screen relative">
        {children}
      </main>
    </>

  );
}