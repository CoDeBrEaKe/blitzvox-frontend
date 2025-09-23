export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-blue-100 flex items-center justify-center min-h-screen ">
      {children}
    </div>
  );
}
