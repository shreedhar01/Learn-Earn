import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from 'next-themes'

import Header from "@/components/Header";

import { WalletContextProvider } from "@/provider/WalletContextProvider";



export const metadata: Metadata = {
  title: "Succeed Trading",
  description: "Learn. Compete. Succeed in Trading",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        <ThemeProvider>
          <WalletContextProvider>
            <Header />
            {children}
          </WalletContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
