'use client';
import Foot from '@/components/Foot';
import Image from "next/image";
import Link from "next/link";
// import { useEffect, useState } from "react";
// import poster from '../../public/poster.jpg';
// import posterEight from '../../public/posterEight.jpg';
// import posterFive from '../../public/posterFive.jpg';
// import posterSeven from '../../public/posterSeven.jpg';
// import posterSix from '../../public/posterSix.jpg';
// import posterThree from '../../public/posterThree.png';
// import posterTwo from '../../public/posterTwo.webp';
import { Button } from "./ui/button";


export default function LandingPage() {
    return (
      <section className="w-[90%] mx-auto">
        <section className="md:hidden mt-2">
          <div className="flex justify-between items-center">
            <div className=" flex justify-between">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={30}
                className="rounded-lg h-auto"
                priority
              />
            </div>
            <div>
              <Link href="/dashboard">
                <Button className="">Dashboard</Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="uppercase w-52 mt-4 mb-8 text-2xl text-center">
              Convert PDF resumes to podcast.
            </h1>
            <Image
              src="/logo.png"
              alt="Logo"
              width={400}
              height={600}
              className="mb-8 rounded-3xl "
              priority
            />

            <Link href="/signup">
              <Button className="w-72 bg-[#09233c] p-2 mb-2 rounded-full h-12 text-white text-lg">
                Create an Account
              </Button>
            </Link>
            <Link href="/login">
              <Button className="w-72 bg-[#09233c] mb-2 rounded-full h-10 text-white text-lg">
                Log In
              </Button>
            </Link>

            <p className="w-80 text-sm p-2 mb-10 text-center">
              By signing up, you are agreeing to our{" "}
              <Link className="text-blue-300" href="">
                Terms of service
              </Link>{" "}
              and{" "}
              <Link className="text-blue-300" href="">
                Public Policy.
              </Link>{" "}
            </p>
          </div>
        </section>

        <section className="hidden md:block">
          <header className="mt-6">
            <nav className="flex justify-between items-center">
              <div className="">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={60}
                  height={40}
                  priority
                  className="rounded-lg h-auto"
                />
              </div>
              <ul className="flex justify-around">
                <li className="p-2 mr-2">
                  <Link href="/">Home</Link>
                </li>
                <li className="p-2 mr-2">
                  <Link href="/">Our Services</Link>
                </li>
                <li className="p-2">
                  <Link href="/">Directory</Link>
                </li>
              </ul>
              <div className="">
                <Link href="/login">
                  <Button className="mr-8">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button className="mr-8 bg-[#09233c] p-2 rounded-md text-white">
                    Sign Up
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="mr-2 bg-[#09233c] p-2 rounded-md text-white">
                    Dashboard
                  </Button>
                </Link>
              </div>
            </nav>
          </header>
          <main>
            <section className="flex justify-between items-center mt-16">
              <div className="w-72 ml-2">
                <p className="text-4xl font-bold">
                  Over <span className="text-blue-400">100</span> PDF
                  resumes converted to podcast.
                </p>
                {/* <span className="mt-2 text-gray-500 block text-base">
                  By peer-reviewing every article posted on waveSort, you are
                  sure of every post.
                </span> */}
              </div>
              <div>
                {/* <Image src={posterEight} alt="Logo" width={400} height={600} className="mb-8 rounded-3xl" priority /> */}
              </div>
              {/* <div className="w-64 h-80 bg-[#09233c] rounded-xl mr-2"></div> */}
            </section>
            <section className="my-10 text-center">
              <h3 className="text-2xl">What Do Our Users say About Us?</h3>
              <p>
                Our 1,000+ customers have only positive things to say about us!
                Take a look.
              </p>
            </section>
            <section className="flex justify-around items-center gap-2">
              {/* <Image src={poster} alt="Poster" width={400} height={600} className="mb-8 rounded-3xl h-72" priority /> */}
              {/* <Image src={posterTwo} alt="Poster Two" width={400} height={600} className="mb-8 rounded-3xl h-72" priority /> */}
              {/* <Image src={posterThree} alt="Poster Three" width={400} height={600} className="mb-8 rounded-3xl h-72" priority /> */}
            </section>

            <section className="flex justify-around items-center mt-6 gap-2">
              {/* <Image src={posterFive} alt="Poster Five" width={400} height={600} className="mb-8 rounded-3xl h-72" priority /> */}
              {/* <Image src={posterSix} alt="Poster Six" width={400} height={600} className="mb-8 rounded-3xl h-72" priority /> */}
              {/* <Image src={posterSeven} alt="Logo" width={400} height={600} className="mb-8 rounded-3xl" priority /> */}
            </section>
          </main>
          <Foot />
        </section>
      </section>
    );
}