  "use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Menu, X, BellDot } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
export default function Navbar({ openModal, user }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Detect scroll
    useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ✅ Close menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setMenuOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignup = () => {
        openModal?.("signup");
        setMenuOpen(false);
    };

    const handleLogin = () => {
        openModal?.("login");
        setMenuOpen(false);
    };

    const handleSignout = async() => {
          try {
            const res=await fetch('/api/auth/userauth/logout', { method: 'POST' });
            if(!res.ok){
              toast.error("couldn't logout")
            }
            else{
              toast.success('Logout Successful!')
              window.location.reload();
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
        setMenuOpen(false);
    };
     if (user === undefined) {
        return (
            <nav className="fixed top-0 left-0 w-full h-20 bg-green-900/90 backdrop-blur-md z-20">
                {/* Simple loading navbar */}
                <div className="h-full flex justify-between items-center px-6 sm:px-10 md:px-20">
                    <div className="flex items-center space-x-3">
                        {/* Your logo */}
                        <div className="w-28 sm:w-36 md:w-40 h-10 bg-gray-300 animate-pulse rounded"></div>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-20 h-8 bg-gray-300 animate-pulse rounded"></div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
      <nav
        className={`fixed top-0 left-0 px-6 sm:px-10 md:px-20 z-20 w-full h-20 flex justify-between items-center transition-all duration-300 ${
          scrolled
            ? "bg-green-900/90 backdrop-blur-md text-white shadow-lg"
            : "text-white"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Image
            src="/Parcellogo.png"
            alt="Parcel Logo"
            width={160}
            height={160}
            className="object-contain w-28 sm:w-36 md:w-40"
          />
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium lg:text-base">
          {user ? (
            // User is logged in
            <>
              <li>
                <a
                  href="#notifications"
                  className="hover:text-gray-300 transition-colors duration-200 flex items-center gap-2"
                >
                  <BellDot size={20} />
                </a>
              </li>

              <li className="relative group">
                <button
                  className="flex items-center gap-2 text-white transition-all duration-200"
                >
                  {user.name || 'Account'}
                  <Image
                    src="/logos/arrows.png"
                    alt="arrow icon"
                    width={18}
                    height={18}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                </button>

                {/* Dropdown for logged in user */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 z-50">
                  <div className="py-2">
                    <a
                      href="/orders"
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 text-center"
                    >
                      Dashboard
                    </a>
                    <button
                      onClick={handleSignout}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 text-center"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </li>
            </>
          ) : (
            // User is not logged in
            <>
              <li>
                <a
                  href="/orders"
                  className="hover:text-gray-300 transition-colors duration-200"
                >
                  Track Order
                </a>
              </li>

              <li className="relative group">
                <button
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-full transition-all duration-200 shadow-lg"
                >
                  Get Started
                  <Image
                    src="/logos/arrows.png"
                    alt="arrow icon"
                    width={18}
                    height={18}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                </button>

                {/* Dropdown for guest */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 z-50">
                  <div className="py-2">
                    <button
                      onClick={handleSignup}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 text-center"
                    >
                      Sign up
                    </button>
                    <button
                      onClick={handleLogin}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 text-center"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden text-white focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute top-full right-4 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 md:hidden transition-all duration-200 z-50"
          >
            <div className="py-2">
              {user ? (
                // Mobile menu for logged in user
                <>
                  <a
                    href="#notifications"
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 text-center justify-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    <BellDot size={16} />
                    Notifications
                  </a>
                  <a
                    href="/dashboard"
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </a>
                  <button
                    onClick={handleSignout}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 text-center"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                // Mobile menu for guest
                <>
                  <a
                    href="/orders"
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    Track Order
                  </a>
                  <button
                    onClick={handleSignup}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 text-center"
                  >
                    Sign up
                  </button>
                  <button
                    onClick={handleLogin}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 text-center"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    );
}
