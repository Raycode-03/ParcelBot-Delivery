import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
function navbarorders() {
  return (
    <>
    {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-6 border-b">
        <Image
          src="/parclelogogreen.png"
          alt="Parcelbot Logo"
          width={140}
          height={40}
          className="object-contain"
        />
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/setting" className="hover:text-green-600">
            Setting
          </Link>
          <Link href="/help" className="hover:text-green-600">
            Help
          </Link>
        </div>
      </nav>
    </>
  )
}

export default navbarorders