'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import { useRef  , useEffect} from 'react';
import Navbar from '@/components/home/navbar';
import Image from 'next/image';
import Link from 'next/link';
import Dropdown from '@/components/home/dropdown';
import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'
function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modal = searchParams.get('modal');
  const modalRef = useRef<HTMLDivElement>(null);
  const openModal = (type: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('modal', type);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const closeModal = () => {
    const params = new URLSearchParams(searchParams);
     params.delete('modal');
    router.replace(`?${params.toString()}`, { scroll: false });
  };
  useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
      };

      if (modal) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [modal]); // ✅ Re-run when modal changes

  
  return (
    <>
  <main className="relative w-full min-h-screen">
      {/* Background Image - Fixed */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/home.png"
          alt="background image"
          fill
          className="object-cover object-center"
          priority
        />
      </div>
      
      {/* Navbar */}
      <Navbar openModal={openModal}/>

      {/* Centered Content */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 py-20 md:mt-10 mt-20">
        <h1 className="text-3xl sm:text-5xl font-semibold text-white max-w-xl leading-snug mb-8">
          Reliable logistics for your E-commerce business
        </h1>

        <form className="bg-white backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-xs md:max-w-sm text-white border-4 border-gray-500/50 mb-60">
          <h2 className="text-2xl font-semibold text-center mb-6 text-black">Estimate your goods</h2>

          <div className="space-y-4">
            {/* dropdown input field */}
            <Dropdown/>

            <div className="relative text-black">
              <label className="block text-sm font-medium mb-2 text-left">From</label>
              <input
                type="text"
                placeholder="Pick-up Location"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              
          <div className="absolute right-3 top-9 bg-green-300/30 p-2 rounded-full flex items-center justify-center">
            <Image
              src="/logos/location.png"
              alt="location icon"
              width={20}
              height={20}
            />
          </div>

            </div>
            
            <div className="text-black">
              <label className="block text-sm font-medium mb-2 text-left">To</label>
              <input 
                type="text" 
                placeholder="Destination" 
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-all text-white mt-4"
            >
              Estimate Price
            </button>
          </div>
        </form>
      </section>
      {/* logic box */}
      <section className="absolute left-0 right-0 mt-[-12em] mx-auto w-[90%] bg-white flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-16 py-12 lg:py-16 border-4 border-gray-900/80 rounded-lg shadow-xl z-10">
    <article className="w-full lg:w-1/2 max-w-2xl text-center lg:text-left mb-8 lg:mb-0 px-4">
      <h1 className="font-semibold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-4 text-gray-900">
        Effortless Delivery with our Logistic Services
      </h1>
      <p className="text-gray-600 text-xs sm:text-lg leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
        Elevate your business with Parcelbot&apos;s end-to-end logistics solutions, seamlessly connecting customers with our dedicated riders for secure deliveries. Experience convenience at every step - request pickups, drop-offs, and delivery services with our efficient and reliable providers.
      </p>
      <button className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-500 rounded-full font-semibold text-white text-base shadow-lg hover:shadow-xl">
        <Link href={'/'}>Get Started</Link>
      </button>
    </article>
    
    <div className="w-full lg:w-1/2 flex justify-center">
      <Image 
        src={'/home/rafiki.png'} 
        alt='rafiki' 
        width={400}
        height={400}
        className='w-full max-w-xs sm:max-w-sm lg:max-w-md h-auto object-contain'
        priority
      />
    </div>
  </section>
 {/* the white space */}
<section className="bg-white w-full px-6 sm:px-12 lg:px-20 py-20 pt-140 md:pt-160 lg:pt-120">
  {/* Parcelbot Experience Section */}
  <section className='mb-20'>
    <div className="text-center mb-12">
    <h2 className="text-2xl sm:text-4xl font-semibold text-gray-900 mb-4">
      The Parcelbot Experience
    </h2>
    <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
      Unlock seamless logistics with Parcelbot — your gateway to effortless deliveries!
    </p>
  </div>

  <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-b-2 border-gray-900 overflow-hidden">
    {/* Box 1 */}
    <div className="flex flex-col items-center justify-center border-r-2 border-gray-900 py-10 hover:bg-gray-100 text-center px-4 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 ease-out">
      <Image 
        src="/home/mobiletracking.png" 
        alt="box icon"
        width={60} 
        height={60}  
        className="object-contain"
      />
      <p className="mt-4 text-gray-800 font-medium">Book a ride in seconds to transport your goods at any time</p>
    </div>

    {/* Box 2 */}
    <div className="flex flex-col items-center justify-center sm:border-r-2 border-gray-900 py-10 hover:bg-gray-100 text-center px-4 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 ease-out">
      <Image 
        src="/home/openparcel.png" 
        alt="secure delivery"
        width={60} 
        height={60} 
        className="object-contain"
      />
      <p className="mt-4 text-gray-800 font-medium">We pick up the cargo. Transporting  your goods made easy</p>
    </div>

    {/* Box 3 */}
    <div className="flex flex-col items-center justify-center border-r-2 border-gray-900 py-10 px-4 text-center bg-gray-50 hover:bg-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 ease-out">
      <Image 
        src="/home/rfidsensor.png" 
        alt="tracking"
        width={60} 
        height={60} 
        className="object-contain"
      />
      <p className="mt-4 text-gray-800 font-medium">You can also track your parcels during the transportation</p>
    </div>

    {/* Box 4 */}
    <div className="flex flex-col items-center justify-center py-10  text-center px-4 hover:bg-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 ease-out">
      <Image 
        src="/home/deliveredbox.png" 
        alt="customer support"
        width={60} 
        height={60}
        className="object-contain"
      />
      <p className="mt-4 text-gray-800 font-medium"> Good delivered. High quality performance at the peak</p>
    </div>
  </div>
  </section>
  {/* Alliited with logos  */}
   <section className="text-center py-10">
      <h3 className="text-gray-400 text-2xl mb-6">Affiliated with:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 gap-y-15 place-items-center">
        <Image 
          src="/home/meters.png" 
          alt="Meters logo"
          width={100} 
          height={100}  
          className="object-contain"
        />
        <Image 
          src="/home/metricalla.png" 
          alt="Metricalla logo"
          width={100} 
          height={100}  
          className="object-contain"
        />
        <Image 
          src="/home/hexatech.png" 
          alt="Hexatech logo"
          width={100} 
          height={100}  
          className="object-contain"
        />
    </div>
  </section>
</section>
{/* end of the white space*/}

  {/* rider link to login */}
    <section className="relative bg-gray-50 flex flex-col lg:flex-row items-center justify-between gap-10 px-6 sm:px-10 lg:px-16 py-12 lg:py-20 shadow-xl">
    {/* Text Section */}
    <div className="flex-1 text-center lg:text-left">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight mb-4">
        Be your own boss.  <br className="hidden sm:block" /> Start driving and earning!
      </h2>
      <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
        Join the Parcelbot team and take control of your earning potential. Whether you&apos;re looking to drive occasionally for a few hours or seeking more frequent opportunities, Parcelbot lets you pick up parcels at your convenience. Become a part of our rider community, delivering swift service to our customers. Embrace flexibility and maximize your earnings with Parcelbot — where every ride counts!
      </p>
      <button className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full shadow-lg font-medium">
        <Link href={'/'}>Become a Rider</Link>
      </button>
    </div>

    {/* Image Section */}
    <div className="flex-1 flex justify-center">
      <Image
        src="/home/rider.png"
        alt="rider illustration"
        width={450}
        height={450}
        className="object-contain w-full max-w-[280px] sm:max-w-md lg:max-w-lg drop-shadow-lg"
        priority
      />
    </div>
  </section>
  
  {/* Tracking input */}
  <section className="absolute left-0 right-0 mt-[-2em] mx-auto w-[75%] sm:w-[75%] md:w-[60%] bg-white flex items-center justify-between gap-2 sm:gap-4 py-[1px] rounded-lg shadow-lg border border-gray-200 z-10">
  <input
    type="text"
    placeholder="Enter Tracking Number"
    className="flex-1 placeholder-gray-500 text-sm sm:text-base focus:outline-none px-3 sm:px-4 py-3 sm:py-5 md:py-6 border-none rounded-full bg-transparent"
  />
  
  <button className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 md:py-6 bg-green-600 hover:bg-green-500 text-white rounded-lg shadow-md font-medium transition-all transform hover:-translate-y-0.5">
    Track
  </button>
</section>



    {/* footer */}
    <footer className="text-white px-6 md:px-16 py-20 ">
  {/* Main Grid Section */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-8">
    {/* About Us */}
    <div>
      <h4 className="text-lg font-semibold mb-4">About Us</h4>
      <ul className="space-y-2 text-sm">
        <li>
          <Link href="" className="hover:text-green-300 transition-colors">
            About us
          </Link>
        </li>
        <li>
          <Link href="/" className="hover:text-green-300 transition-colors">
            Become a rider
          </Link>
        </li>
        <li>
          <Link href="/" className="hover:text-green-300 transition-colors">
            Transport your goods
          </Link>
        </li>
      </ul>
    </div>

    {/* Privacy Section */}
    <div>
      <h4 className="text-lg font-semibold mb-4">Privacy</h4>
      <ul className="space-y-2 text-sm">
        <li>
          <Link href="/" className="hover:text-green-300 transition-colors">
            Terms & Conditions
          </Link>
        </li>
        <li>
          <Link href="/" className="hover:text-green-300 transition-colors">
            Privacy Policy
          </Link>
        </li>
      </ul>
    </div>

    {/* Parcelbot Info */}
    <div>
      <h4 className="text-lg font-semibold mb-4">Parcelbot</h4>
      <p className="text-sm text-gray-200 mb-3">
        Connecting customers and riders. Get your goods transported by our riders.
      </p>
      <h5 className="font-semibold mb-1">Contact us:</h5>
      <p className="text-sm mb-3">(234) 7017-3453-453</p>
      <div className="flex items-center gap-8">
        <Link href={'https://instagram.com'}><Image src="/logos/instagram.png" alt="Instagram" width={25} height={25} /></Link>
        <Link href={'https://facebook.com'}><Image src="/logos/facebook.png" alt="Facebook" width={25} height={25} /></Link>
      </div>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="pt-4 text-center text-sm">
    All rights reserved &copy; {new Date().getFullYear()} Parcelbot.com.
  </div>
</footer>
{/* ✅ Conditional Modal Rendering */}
        {modal === 'signup' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative"  ref={modalRef}>
              <SignupForm />
              
            </div>
          </div>
        )}

        {modal === 'login' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"  >
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative"  ref={modalRef}>
              <LoginForm />
              
            </div>
          </div>
        )}
    </main>
</>

  )
}

export default Page