import type { Metadata } from "next";
import "./globals.css";
// app/layout.js (App Router) or pages/_app.js (Pages Router)
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "700"], // Specify desired weights
  subsets: ["latin"],
  display: "swap", // Recommended for font loading
});
export const metadata: Metadata = {
  title: "Bliztvox Portal",
  description: "Blitzvox CRM",
};

import StoreProvider from "@/redux/StoreProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-blue-100 ${roboto.className}`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
