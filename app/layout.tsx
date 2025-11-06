import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
export const metadata: Metadata = {
  title: "Parcelbot ",
  description: "Welcome to Parcelbot - A place where a business owner can seamlessly connect to customers with our dedicated riders for secure deliveryies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={""}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
