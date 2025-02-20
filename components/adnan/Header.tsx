"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Apartments", href: "/apartments" },
    { name: "List Your Property", href: "/list-property" },
  ];

  return (
    <header className="sticky top-0 z-20 w-full bg-white px-52 py-6 transition-all duration-300">
      <nav className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-gray-800 font-bold text-xl">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
          {/* <span>MyBrand</span> */}
        </Link>

        {/* Links - Desktop */}
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  pathname === item.href
                    ? "bg-gray-200 text-gray-900 shadow-md"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Sign In Button */}
        <Link
          href="/signin"
          className="hidden md:block px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-300"
        >
          Sign In
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-800 transition-all duration-300"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t shadow-md py-4 text-center flex flex-col gap-3 md:hidden transition-all duration-300">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 transition-all duration-300 ${
                pathname === item.href
                  ? "bg-gray-200 text-gray-900 rounded-full shadow-md"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/signin"
            className="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
}
