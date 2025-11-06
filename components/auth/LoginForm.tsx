"use client";
import React from 'react'
import { useState, FormEvent } from "react";
import SignInBtn from "@/auth/signinbtn";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import IsLoading from "@/components/loading/loading";
import {Eye} from 'lucide-react'
function LoginForm() {
   const [email, setEmail] = useState(""); 
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
   };
  return (
    <div>
            {/* Heading */}<CardHeader className="space-y-3 pb-0">
        <div className="text-center space-y-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              Login into your account
            </CardTitle>
            
          </div>
        </CardHeader>
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-2 mb-1">
            <Label htmlFor="password">Password</Label>
            <div>
                <Input
              id="password"
                type="password"
              required
                 placeholder='Enter a safe password'
                 onChange={(e) => setPassword(e.target.value)}
                />
                <Eye/>
            </div>
          </div>
          <div className="text-sm  flex justify-start">
            <input type="checkbox" name="staysigned" id="" />
            <label htmlFor="stay signed">Stay signed in</label>
            </div>
          <div className="text-sm  flex justify-end">
            <Link href={`/forgotpassword`} className="text-gray-500 mt-2 hover:underline hover:text-blue-300">Forgot Password?</Link>
          </div>
        </CardContent>

        {/* Buttons */}
        <CardFooter className="flex flex-col gap-3 mt-2">
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-500" disabled={loading}>
              {loading ? (
                <IsLoading loadstate={true} />
            ) : (
                  <>
                    Login
                  </>
            )}
          </Button>


          <div className="mt-1 space-y-3">
            <SignInBtn provider="google" variant="google" />
          </div>

          {/* Bottom Link */}
          <p className="text-sm text-gray-500 mt-2">
            Dont&apos;t have an account
            <Link href={'/signup'} className='text-green-600 hover:text-green-300'>
             Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </div>
  )
}

export default LoginForm