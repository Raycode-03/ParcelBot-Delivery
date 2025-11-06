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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import IsLoading from "@/components/loading/loading";
import {Eye} from 'lucide-react'
function SignupForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address , setAddress] = useState("");
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
              Sign up to get started
            </CardTitle>
          </div>
        </CardHeader>
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              required
              onChange={(e) => setName(e.target.value)}
            />    
            </div>  
          <div className="grid gap-2">
            <Label htmlFor="Address">Address</Label>
            <Input
              id="address"
              type="text"
              placeholder="Enter home address"
              required
              onChange={(e) => setAddress(e.target.value)}
              />
          </div>
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
            <Label htmlFor="password">Create Password</Label>
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

          </div>
        </CardContent>

        {/* Buttons */}
        <CardFooter className="flex flex-col gap-3 mt-2">
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-500" disabled={loading}>
              {loading ? (
                <IsLoading loadstate={true} />
            ) : (
                  <>
                   Done 
                  </>
            )}
          </Button>

          <div className="mt-1 space-y-3">
            <SignInBtn provider="google" variant="google" />
          </div>

          {/* Bottom Link */}
          <p className="text-sm text-gray-500 mt-2">
            Already have an account?
            <Link href={'/login'} className='text-green-600 hover:text-green-300'>
                Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </div>
  )
}

export default SignupForm