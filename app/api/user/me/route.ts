// app/api/user/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { get_db, connect_db } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET!;
export async function GET() {
  try {

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    if (!accessToken) {
      console.log('❌ No access token found');
      return NextResponse.json({ user: null });
    }

    // Verify the access token
    try {
      const decoded = jwt.verify(accessToken, JWT_SECRET) as any;
      console.log('✅ JWT verified successfully');
      
      
      await connect_db();
      const db = get_db();
      const collection = db.collection("users");
      
      // ✅ Convert string to ObjectId for MongoDB query
      const user = await collection.findOne(
        { _id: new ObjectId(decoded.userId) },
        { projection: { password: 0 } }
      );

      
      
      if (!user) {
        console.log('❌ User not found in database');
        return NextResponse.json({ user: null });
      }

      
      
      // ✅ RETURN THE USER DATA - Make sure this is what gets returned
      return NextResponse.json({ 
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          address: user.address,
        }
      });

    } catch (jwtError) {
      console.error('❌ JWT verification failed:', jwtError);
      const response = NextResponse.json({ user: null });
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }

  } catch (error) {
    console.error('💥 /api/user/me error:', error);
    const response = NextResponse.json({ user: null });
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }
}