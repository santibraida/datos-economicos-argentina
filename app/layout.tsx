import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "API Dólar Argentina",
  description:
    "Cotizaciones del dólar, euro, real y más en Argentina en tiempo real",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
