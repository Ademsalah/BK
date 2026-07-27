import Sidebar from "./dashboard/components/SideBar";
import type { ReactNode } from "react";


export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}