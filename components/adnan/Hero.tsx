"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

export default function Hero() {
  return (
    <div className="!pt-0 px-4 pb-4 md:px-6 md:pb-6 lg:px-8">
      <div className="relative isolate overflow-hidden bg-[url('/hero.jpg')] bg-no-repeat bg-center bg-cover h-[80vh] w-full rounded-3xl shadow-lg flex items-center justify-center">
        <div className="mx-auto max-w-3xl text-center">
          {/* Title */}
          <motion.h1
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Find Your Perfect Property
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mt-4 text-lg text-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover a wide range of properties that suit your needs and preferences.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            className="mt-8 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative flex items-center bg-white rounded-full shadow-md px-4 py-2 w-full max-w-xl">
              <button className="text-gray-500">
                <Filter className="h-5 w-5" />
              </button>
              <Input
                type="text"
                placeholder="Search properties..."
                className="flex-grow border-none focus:outline-none px-4 text-gray-700 placeholder-gray-500 bg-transparent"
              />
              <Button className="bg-orange-500 text-white rounded-full p-2 shadow-lg hover:bg-orange-600 transition">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
