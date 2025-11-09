import type { Metadata } from "next";
import "./globals.css";
import ClientVisualEdits from "../visual-edits/ClientVisualEdits";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";

export const metadata: Metadata = {
  title: "MEC Eats - Good Food. Good Mood. Delivered in Yor Tung.",
  description: "College Hostel Food Ordering System - Order from Campus Curry Hub, Snack Shack, South Spice, Juice Junction, and Madras Cafe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        {children}
  <ClientVisualEdits />
      </body>
    </html>
  );
}