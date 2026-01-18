"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Users,
  Package,
  MapPin,
  Trophy,
  ShoppingCart,
  Sprout,
  ChevronDown,
  Image,
  FileText,
  BarChart,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  const navLinks = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart,
    },
    {
      name: "Products",
      href: "/Products",
      icon: Package,
    },
    {
      name: "Users",
      href: "/User/AllUser",
      icon: Users,
      subLinks: [
        { name: "All Users", href: "/User/AllUser" },
      ],
    },
    {
      name: "Planted Trees",
      href: "/Planted",
      icon: Sprout,
    },
    {
      name: "Orders",
      href: "/OrderDetails",
      icon: ShoppingCart,
    },
    {
      name: "Banners",
      href: "/Banners",
      icon: Image,
    },
    {
      name: "Blogs",
      href: "/Blogs",
      icon: FileText,
    },
    {
      name: "Map",
      href: "/AddMap",
      icon: MapPin,
    },
    {
      name: "Leaderboard",
      href: "/Leadre",
      icon: Trophy,
    },
  ];

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Sprout className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">Vanagrow Admin</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  <Link
                    href={link.href}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.href)
                      ? "bg-white/20 text-white shadow-md"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                    {link.subLinks && (
                      <ChevronDown className="h-3 w-3 ml-1" />
                    )}
                  </Link>

                  {/* Dropdown for sublinks */}
                  {link.subLinks && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-2">
                        {link.subLinks.map((subLink) => (
                          <Link
                            key={subLink.name}
                            href={subLink.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            {subLink.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <div key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-3 rounded-lg text-base font-medium transition-all ${isActive(link.href)
                    ? "bg-white/20 text-white"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.name}</span>
                </Link>

                {/* Mobile sublinks */}
                {link.subLinks && (
                  <div className="ml-8 mt-1 space-y-1">
                    {link.subLinks.map((subLink) => (
                      <Link
                        key={subLink.name}
                        href={subLink.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {subLink.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
