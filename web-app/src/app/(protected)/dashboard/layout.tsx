import Sidebar from "./components/SideBar";


export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="ml-64 w-full p-6 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}