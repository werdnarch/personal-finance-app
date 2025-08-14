import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import SideBar from "@/components/ui/SideBar";
import { TanstackProvider } from "@/components/providers/tanstack-provider";

const FontSans = Public_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Finance App",
  description: "personal finance app challenge from frontendmentor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${FontSans.variable} antialiased`}>
        <main className="h-screen flex">
          <SideBar />
          <section className="w-full  overflow-y-auto">
            <TanstackProvider>{children}</TanstackProvider>
          </section>
        </main>
      </body>
    </html>
  );
}
