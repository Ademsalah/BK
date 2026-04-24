import Sidebar from "./dashboard/components/SideBar";


export default function ProtectedLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}