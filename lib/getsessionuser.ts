import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email?: string };

    return decoded; // includes userId, maybe email if stored in JWT
  } catch (error) {
    console.error("Invalid or expired token:", error);
    return null;
  }
}
