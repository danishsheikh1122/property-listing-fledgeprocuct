import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative h-[50vh]">
      {/* Background Image */}
      <Image
        src="/hero2.jpg"
        alt="Person working remotely"
        fill
        className="object-cover"
        priority
      />

      <svg
        viewBox="0 0 1440 70"
        className="absolute -bottom-[0] left-0 w-full z-[10]"
      >
        <path
    d="M1440,21.2101911 L1440,120 L0,120 L0,21.2101911 C120,35.0700637 240,42 360,42 C480,42 600,35.0700637 720,21.2101911 C808.32779,12.416393 874.573633,6.87702029 918.737528,4.59207306 C972.491685,1.8109458 1026.24584,0.420382166 1080,0.420382166 C1200,0.420382166 1320,7.35031847 1440,21.2101911 Z"
    className="fill-white"
  ></path>
      </svg>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Navigation */}
      <nav className="absolute w-full p-4">
        <div className="container mx-auto flex items-center justify-end gap-4">
          <Button
            variant="secondary"
            className="bg-[#f43f5e] text-white hover:bg-[#f43f5e]/90"
          >
            List a Property →
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/10">
            Log in
          </Button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-16 mt-5">
        <div className="text-center text-white">
          <h1 className="mb-2 text-4xl font-bold md:text-5xl lg:text-5xl">
            The key to Home
          </h1>
          <h2 className="text-4xl font-bold md:text-5xl lg:text-5xl">
            The key to Happiness
          </h2>

          {/* Search Bar */}
          <div className="relative mx-auto mt-8 max-w-xl px-3">
            <Search className="absolute left-8 top-3 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search..."
              className="h-12 w-full rounded-full bg-white pl-14 pr-4 text-lg text-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
