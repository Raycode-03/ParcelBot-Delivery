"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {toast} from 'sonner'
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const cfg = {
  title: "Set a new Password",
  description: "Step by step reset with email verification",
  success: "Password reset successful!",
  error: "Something went wrong",
  emailButton: "Verify Email",
  codeButton: "Verify Reset Code",
  passwordButton: "Set New Password",
  linkButton: "← Back to login",
  linkHref: "/?modal=login",
};

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // form fields
  const [email, setEmail] = useState("");
  const [resetcode, setresetcode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // step states
  const [emailVerified, setEmailVerified] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  async function handleVerifyEmail(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/userauth/forgot-password/verify-email`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || cfg.error);
        
        
    }
        else{
            setEmailVerified(true);
            toast.success(data.success ||"Email verified. Enter your reset code.")
        }

        
    } catch (error) {
      console.log(error);
      toast.error( "Something went wrong, please try again.")
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {

      const res = await fetch(`/api/auth/userauth/forgot-password/verify-reset-code`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, resetcode: resetcode.toString() }),
      });
      const data = await res.json();

      if (!res.ok) toast.error(data.error || "can't verify reset code")
      else{
            setCodeVerified(true);
            toast.success(data.success || "Code verified. Enter your new password.")
      }

      
    } catch (error) {
      console.log(error);
      toast.error( "Something went wrong, please try again.")
    } finally {
      setLoading(false);
    }
  }

  async function handleSetPassword(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/userauth/forgot-password/new-password`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email,resetcode: resetcode.toString(), password: newPassword }),
      });
      const data = await res.json();

      if (!res.ok) toast.error(data.error || cfg.error)
      else{
          toast.success(data.success || cfg.success)
          router.push("/?modal=login");
        }

      
    } catch (error) {
        console.log(error);
        toast.error( "Something went wrong, please try again.")
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center"> 
      <Card className="w-full max-w-sm "> 
        <CardHeader className="space-y-2"> 
        <CardTitle className="text-3xl font-bold text-center">{cfg.title}</CardTitle>
          <CardDescription className="text-gray-600">
            {cfg.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Verify Email */}
          <form
            onSubmit={handleVerifyEmail}
            className={`${emailVerified ? "hidden" : "space-y-4"}`}
          >
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                disabled={emailVerified}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <CardFooter className="px-0">
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-white"
                disabled={loading}
              >
                {loading ? "Verifying..." : cfg.emailButton}
              </Button>
            </CardFooter>
          </form>

          {/* Step 2: Verify Reset Code */}
          <form
            onSubmit={handleVerifyCode}
            className={`${!emailVerified || codeVerified ? "hidden" : "space-y-4"}`}
          >
            <div className="grid gap-2">
              <Label htmlFor="reset_code" className="text-sm font-medium text-gray-700">
                Reset Code
              </Label>
              <Input
                id="reset_code"
                type="text"
                placeholder="Enter 6-digit code"
                required
                maxLength={6}
                value={resetcode}
                disabled={codeVerified}
                onChange={(e) => setresetcode(e.target.value)}
              />
            </div>
            <CardFooter className="px-0">
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-white"
                disabled={loading}
              >
                {loading ? "Verifying..." : cfg.codeButton}
              </Button>
            </CardFooter>
          </form>

          {/* Step 3: New Password */}
          <form
            onSubmit={handleSetPassword}
            className={`${!codeVerified ? "hidden" : "space-y-4"}`}
          >
            <div className="grid gap-2">
              <Label htmlFor="new_password" className="text-sm font-medium text-gray-700">
                New Password
              </Label>
              <Input
                id="new_password"
                type="password"
                required
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <CardFooter className="px-0">
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-white"
                disabled={loading}
              >
                {loading ? "Updating..." : cfg.passwordButton}
              </Button>
            </CardFooter>
          </form>
        </CardContent>

        {/* Footer */}
        <Separator className="my-2 bg-gray-200" />
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            <Link href={cfg.linkHref}>
              <Button variant="link" type="button" className="text-green-600 hover:text-green-500 p-0 h-auto">
                {cfg.linkButton}
              </Button>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
