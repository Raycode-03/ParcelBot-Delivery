import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json({ 
        success: true,
        message: "Logged out successfully"
    });
    
    // Clear both cookies
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    
    return response;
    }catch (error:any) {
        const isDbError = error.message?.includes('MongoNetworkError') || error.message?.includes('ENOTFOUND');
        console.error("Error logging out user:", error);
        return NextResponse.json({ error: isDbError ? "Network unavailable" : "Internal server error" }, { status: 500 });
    }
    
}