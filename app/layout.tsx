// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { UserProvider } from "@/utils/UserProvider";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { get_db, connect_db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const metadata: Metadata = {
  title: "Parcelbot",
  description: "Welcome to Parcelbot...",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    
    if (accessToken) {
      // ✅ Direct JWT verification + database call (no HTTP request)
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as any;
      
      await connect_db();
      const db = get_db();
      const collection = db.collection("users");
      
      const userDoc = await collection.findOne(
        { _id: new ObjectId(decoded.userId) },
        { projection: { password: 0 } }
      );
      
      if (userDoc) {
        user = {
          id: userDoc._id.toString(),
          name: userDoc.name,
          email: userDoc.email,
          address: userDoc.address,
        };
      }
    }
  } catch (error) {
    console.error('Layout auth check failed:', error);
  }

  return (
    <html lang="en">
      <body>
        <UserProvider user={user}>
          {children}
          <Toaster position="top-right" richColors />
        </UserProvider>
      </body>
    </html>
  );
}