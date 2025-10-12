import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import Script from "next/script"; // ✅ Add this import
import StoreProvider from "@/redux/StoreProvider";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blitzvox Portal",
  description: "Blitzvox CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Microsoft Clarity script */}
        <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "ton0d20opw");
            `,
          }}
        />
      </head>
      <body className={`bg-blue-100 ${roboto.className}`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
