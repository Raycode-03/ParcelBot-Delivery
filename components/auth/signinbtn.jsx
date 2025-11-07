"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import IsLoading from "@/components/loading/loading";
const SignInBtn = ({
  provider,
  variant = "default",
}) => {
     const [loading, setLoading] = useState(false)
  return (
    <>
     <IsLoading loadstate={loading} />
    
    <Button
      variant={variant}
      className="w-full p-4 text-[12px] sm:text-sm"
      onClick={() => {
        setLoading(true);
        signIn(provider, { callbackUrl: "/" })
          .finally(() => setLoading(false));
      }}
      disabled={loading}
    >
 {loading && (
          <div className="mr-2 animate-spin">
           
          </div>
        )}
      <Image
        src={`/logos/${provider.toLowerCase()}.svg`}
        alt={`${provider} logo`}
        width={20}
        height={20}
        className="mr-2 inline-block"
      />
      {loading ? "Signing in..." : `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
    </Button>
    </>
  );
};

export default SignInBtn;
