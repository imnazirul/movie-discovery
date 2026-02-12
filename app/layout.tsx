import React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/Provider/ThemeProvider";
import Navbar from "@/components/Header";
import QueryClientProviderWrapper from "@/components/QueryWrapper";
import Provider from "@/Provider/Provider";
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MovieZen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-poppins`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProviderWrapper>
            <Provider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <div className="flex-1">{children}</div>
              </div>
            </Provider>
          </QueryClientProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
