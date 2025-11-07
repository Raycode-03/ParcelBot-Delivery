"use client";
import React from 'react'
import { useState, FormEvent } from "react";
import { useRouter } from 'next/navigation';
import SignInBtn from "@/auth/signinbtn";
import Link from "next/link";
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
import {Eye , EyeClosed} from 'lucide-react'

function SignupForm({  closeModal}: { closeModal:()=>void; }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address , setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword , setShowPassword] = useState(false);
    const router = useRouter();
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      
    const res =await fetch(`/api/auth/userauth/signup`,{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name , email , address , password}), 
    }) 
    const data =await res.json();
    if (!res.ok) {
        toast.error( data.error || 'failed to Sign up new user');
      }
      else{
        toast.success( 'User Created')
         if (data.user) {
            closeModal();
            router.refresh();    
          }
      }
    } catch (err) {
      console.error(err)
    }finally{
      setLoading(false)
    }
    };
  return (
 <div className="w-full bg-white">
  {/* Heading */}
  <CardHeader className="space-y-1 pb-0 px-3 pt-3 sm:px-6 sm:pt-6">          
    <div className="text-center space-y-0.5">
      <CardTitle className="text-base sm:text-xl font-semibold text-foreground">
        Sign up to get started
      </CardTitle>
    </div>
  </CardHeader>

  {/* Form */}
  <form onSubmit={handleSubmit}>
    <CardContent className="space-y-2 sm:space-y-4 px-3 sm:px-6 py-2">
      {/* Full Name */}
      <div className="grid gap-1">
        <Label htmlFor="name" className="text-xs">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          required
          onChange={(e) => setName(e.target.value)}
          className="h-7 sm:h-10 text-xs sm:text-sm"
        />    
      </div>  

      {/* Address */}
      <div className="grid gap-1">
        <Label htmlFor="address" className="text-xs">Address</Label>
        <Input
          id="address"
          type="text"
          placeholder="Enter home address"
          required
          onChange={(e) => setAddress(e.target.value)}
          className="h-7 sm:h-10 text-xs sm:text-sm"
        />
      </div>

      {/* Email */}
      <div className="grid gap-1">
        <Label htmlFor="email" className="text-xs">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          onChange={(e) => setEmail(e.target.value)}
          className="h-7 sm:h-10 text-xs sm:text-sm"
        />
      </div>

      {/* Password with Toggle */}
      <div className="grid gap-1 mb-0.5">
        <Label htmlFor="password" className="text-xs">Create Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Enter a safe password"
            onChange={(e) => setPassword(e.target.value)}
            className="h-7 sm:h-10 text-xs sm:text-sm pr-7"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showPassword ? (
              <EyeClosed className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </button>
        </div>
      </div>
    </CardContent>

    {/* Buttons */}
    <CardFooter className="flex flex-col gap-1.5 mt-0.5 px-3 sm:px-6 pb-3 sm:pb-6">
      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-500 h-7 sm:h-10 text-xs sm:text-sm font-medium" 
        disabled={loading}
      >
        {loading ? (
          "Creating account..."
        ) : (
          "Create Account"
        )}
      </Button>

      {/* Social Sign In */}
      <div className="mt-0.5 space-y-1.5 w-full">
        <SignInBtn provider="google" variant="google" />
      </div>

      {/* Bottom Link */}
      <p className="text-xs text-gray-500 text-center">
        Already have an account?{' '}
        <Link 
          href={'/?modal=login'} 
          className='text-green-600 hover:text-green-500 font-medium transition-colors'
        >
          Sign in
        </Link>
      </p>
    </CardFooter>
  </form>
</div>
  )
}

export default SignupForm