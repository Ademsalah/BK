import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />

      <main className="flex-1 w-full">{children}</main>

      <Footer />
    </div>
  );
}
