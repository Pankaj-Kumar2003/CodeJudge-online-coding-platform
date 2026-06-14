import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css"; // Ensure your Tailwind styles are correctly mapped

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeJudge - Algorithmic Testing Arena",
  description:
    "Execute, evaluate, and submit sandboxed code solutions in real-time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} bg-black text-gray-100 h-full flex flex-col overflow-hidden antialiased`}
      >
        {/* 💡 The global Navbar is now mounted at the root layout wrapper */}
        <Navbar />

        {/* Main application page container slots straight down below */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
