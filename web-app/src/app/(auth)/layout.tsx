export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* LEFT / RIGHT BLUE SIDE */}
      <div className="w-1/3 bg-[#07173b] hidden md:block"></div>

      {/* FORM SIDE */}
      <div className="w-full md:w-2/3 flex items-center justify-center bg-gray-100">
        {children}
      </div>
    </div>
  );
}


