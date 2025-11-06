"use client"
import React from 'react'
import { useState, FormEvent } from "react";
import Image from 'next/image'
import { Card } from "@/components/ui/card"
import { Input } from './ui/input';
import { Button } from "@/components/ui/button"
import { Textarea } from './ui/textarea';
import { Mail , PhoneCall } from 'lucide-react';
import { toast } from "sonner"
function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sendloading , setsendloading] = useState(false);
  const handleemailsumbit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("email sent");
    // Reset form
    setEmail("");
    setMessage("");
    setsendloading(true);
    try {
      const baseurl=process.env.NEXTAUTH_URL || "";
        const res = await fetch(`${baseurl}/api/sendemail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, message }),
        });
        if (!res.ok) {
          toast.error("Failed to send email");
        } else {
          toast.success("Email sent successfully");
        }
    } catch (err) {
      console.error("Error sending email:", err);
      
    }finally{
      setsendloading(false);
    }
    
  }

  return (
    
 <Card className="bg-neutral-950 text-gray-100 p-6 sm:p-10 lg:p-12 rounded-none shadow-lg w-full max-w-none border-none">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
    
    {/* Left section */}
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-white">
          Contact
        </h2>
        <p className="text-gray-400 leading-relaxed text-base sm:text-lg">
          I&apos;d love to hear about your project or collaboration ideas. 
          Fill out the form and I&apos;ll get back to you soon.
        </p>
      </div>

      {/* Contact Info */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-800">
            <PhoneCall className="text-teal-400 w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <p className="text-gray-300 text-sm sm:text-base">+234 916 701 9229</p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-800">
            <Mail className="text-teal-400 w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <p className="text-gray-300 text-sm sm:text-base">
            akereleolasun5@gmail.com
          </p>
        </div>
      </div>
    </div>

    {/* Right section (form + socials) */}
    <div className="flex flex-col justify-between space-y-8 sm:space-y-10">
      <form onSubmit={handleemailsumbit} className="space-y-5 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4">
          <Input
            type="email"
            placeholder="example@com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={50}
            className="bg-black border-b border-gray-600 focus:border-b-gray-400 text-white placeholder-gray-500 w-full rounded-none focus:ring-0 text-base sm:text-lg focus-within:bg-black border-t-0 border-l-0 border-r-0"
          />
          <Textarea
            placeholder="Your message..."
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={400}
            className="bg-transparent border-b border-gray-600 text-gray-100 placeholder-gray-500 w-full rounded-none resize-none focus:border-teal-400 focus:ring-0 text-base sm:text-lg border-t-0 border-l-0 border-r-0"
          />
        </div>

        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 sm:py-5 px-6 sm:px-8 rounded-md w-full lg:w-auto transition-all duration-200 text-base sm:text-lg"
        >
          {sendloading ? "Sending..." : "Send Message"}
        </Button>
      </form>

      {/* Social Icons */}
      <div className="flex space-x-4 sm:space-x-5 justify-start sm:justify-end pt-2 sm:pt-4">
        <a href="https://github.com/Raycode-03?tab=repositories" className="hover:opacity-80 transition bg-white rounded-full p-1 sm:p-1.5">
          <Image src="/logos/github.png" alt="GitHub" width={28} height={28} className="rounded-full" />
        </a>
        <a href="https://www.linkedin.com/in/akerele-raymond-a30351381?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="hover:opacity-80 transition">
          <Image src="/logos/linkedin.png" alt="LinkedIn" width={32} height={32} />
        </a>
        <a href="https://www.instagram.com/raycode_03?igsh=YWpsOHkwZWV5Mmx3" className="hover:opacity-80 transition">
          <Image src="/logos/instagram.png" alt="Instagram" width={32} height={32} />
        </a>
        <a href="https://wa.me/+2349167019229" className="hover:opacity-80 transition">
          <Image src="/logos/whatsapp.png" alt="WhatsApp" width={32} height={32} />
        </a>
      </div>
    </div>

  </div>
</Card>


  )
}

export default Contact