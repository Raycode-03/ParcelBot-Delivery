import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    session: { 
        strategy: "jwt", 
        maxAge: 7 * 24 * 60 * 60, // 7 days
        updateAge: 3 * 24 * 60 * 60 // 3 days
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
        GitHub, 
        Google,
    ]
});