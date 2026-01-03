import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Scalable App - Midnight Aurora",
  description: "A secure and scalable web application with modern Midnight Aurora Glass UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.className} selection:bg-cyan-500/30`}>
        <div className="aurora-container">
          <div className="aurora-blur w-[500px] h-[500px] bg-cyan-500 top-[-10%] left-[-10%]"></div>
          <div className="aurora-blur w-[600px] h-[600px] bg-indigo-600 bottom-[-20%] right-[-10%] animation-delay-2000"></div>
          <div className="aurora-blur w-[400px] h-[400px] bg-pink-500 top-[20%] right-[-5%] animation-delay-4000"></div>
        </div>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
