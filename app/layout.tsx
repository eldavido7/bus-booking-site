import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BookingProvider } from "../context/BookingContext";
import { Toaster } from "../components/ui/sonner";
import ConditionalLayout from "../components/layout/ConditionalLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TravelEase - Premium Bus Booking Platform",
  description: "Book comfortable and affordable bus tickets online with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BookingProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster />
        </BookingProvider>
      </body>
    </html>
  );
}
