// app/api/auth/userauth/signup/route.ts
import { NextResponse } from "next/server";
import { validateuser } from "@/validations/validateuser";
import { signin_services } from "@/services/userservices";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate user input
        const validationerror = validateuser(body);
        if (validationerror) {
            return NextResponse.json({ error: validationerror }, { status: 400 });
        }

        // Services for new user
        const serviceResult = await signin_services(body);
        
        if (typeof serviceResult === "string") {
            // This means service returned an error message
            return NextResponse.json({ error: serviceResult }, { status: 400 });
        }

        // ✅ CREATE SESSION TOKENS
        const accessToken = jwt.sign(
            { userId: serviceResult._id.toString() },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: serviceResult._id.toString(), type: 'refresh' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // ✅ SET COOKIES and return user data
        const response = NextResponse.json({ 
            success: true,
            user: {
                id: serviceResult._id.toString(),
                name: serviceResult.name,
                email: serviceResult.email,
                address: serviceResult.address,
            }
        }, { status: 201 });

        response.cookies.set('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 // 15 minutes
        });

        response.cookies.set('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;
        

    } catch (error: any) {
        const isDbError = error.message?.includes('MongoNetworkError') || error.message?.includes('ENOTFOUND');
        console.error("Error registering user:", error);
        return NextResponse.json({ error: isDbError ? "Network unavailable" : "Internal server error" }, { status: 500 });
    }
}