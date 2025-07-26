import NavbarSidebar from "./components/navbar";

export default function Layout({ children }) {
  return (
    <>
      <NavbarSidebar />
      <main className="flex-1 bg-gray-200 ml-[100px]">
        {children}
      </main>
    </>

  );
}