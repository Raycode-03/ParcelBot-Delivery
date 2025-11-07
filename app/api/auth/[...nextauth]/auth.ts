import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import clientPromise from "@/lib/mongodb_auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter";
export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    session: { 
        strategy: "jwt", 
        maxAge: 15* 60, // 15 mins
        updateAge: 60 * 60  // 1 hrs
    },
    // cookies:{
    //     sessionToken: {
    //         name: `next-auth.session-token`,
    //         options: {
    //             httpOnly: true,
    //             sameSite: 'lax',
    //             path: '/',
    //             secure: process.env.NODE_ENV === 'production',
    //             maxAge: 7 * 24 * 60 * 60, // 7 days
    //             updateAge: 3 * 24 * 60 * 60 // 3 days // ← Make this match! 10 seconds for cookie too
    //         },
    //     }
    // },
    providers: [ 
        Google,
    ],

});