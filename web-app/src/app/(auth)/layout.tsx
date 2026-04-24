export default function AuthLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[rgb(7,23,59)] flex items-center justify-center">
      {children}
    </div>
  );
}