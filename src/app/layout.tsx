import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Task Management",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        {/* <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/prismjs@1.28.0/themes/prism.min.css"
        /> */}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
