import type { Metadata } from "next";
import "./lib/polyfills";
import "./globals.css";
import "./lib/envSetup";

export const metadata: Metadata = {
  title: "J%T Bank: Customer Onboarding Chat",
  description: "Prototyp aplikace pro overeni moznosti AI .",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
