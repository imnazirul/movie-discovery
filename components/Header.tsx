"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Heart, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Input from "./ui/Input";
import Button from "./ui/Button";
import ModeToggle from "@/Provider/ThemeToggle";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = ["Home", "Shop", "Collections", "About", "Contact"];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 text-black transition-all duration-300 ${isScrolled
                    ? "dark:bg-gradient-to-r dark:from-[#1a243a] dark:via-[#04102e] dark:to-[#020817] dark:bg-[#020817] bg-white dark:text-white text-black shadow-md py-3"
                    : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl backdrop-blur-xl mx-auto px-4 flex items-center justify-between">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden mr-2"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <Menu
                            className={`h-6 w-6 ${isScrolled || isMenuOpen
                                    ? "dark:text-white text-black"
                                    : "dark:text-white text-black"
                                }`}
                        />
                    </Button>
                    <Link href="/" className="text-2xl font-bold">
                        <span
                            className={`inline-block transition-all duration-500 ${
                                isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
                            } ${isScrolled
                                    ? "dark:text-white text-black"
                                    : "dark:text-white text-black"
                                }`}
                        >
                            UPMART
                        </span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center space-x-8">
                    {navItems.map((item, index) => (
                        <div
                            key={item}
                            className={`transition-all duration-500 ${
                                isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
                            }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <Link
                                href={`/${item.toLowerCase()}`}
                                className={`font-medium hover:opacity-70 transition-opacity ${isScrolled
                                        ? "dark:text-white text-black"
                                        : "dark:text-white text-black"
                                    }`}
                            >
                                {item}
                            </Link>
                        </div>
                    ))}
                </nav>

                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                        <Search
                            className={`h-5 w-5 ${isScrolled
                                    ? "dark:text-white text-black"
                                    : "dark:text-white text-black"
                                }`}
                        />
                    </Button>
                    <ModeToggle isScrolled={isScrolled} />
                    <Button
                        onClick={() => router.push("/auth")}
                        variant="ghost"
                        size="icon"
                        className="hidden sm:flex"
                    >
                        <User
                            className={`h-5 w-5 ${isScrolled
                                    ? "dark:text-white text-black"
                                    : "dark:text-white text-black"
                                }`}
                        />
                    </Button>
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                        <Heart
                            className={`h-5 w-5 ${isScrolled
                                    ? "dark:text-white text-black"
                                    : "dark:text-white text-black"
                                }`}
                        />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <ShoppingBag
                            className={`h-5 w-5 ${isScrolled
                                    ? "dark:text-white text-black"
                                    : "dark:text-white text-black"
                                }`}
                        />
                        <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            3
                        </span>
                    </Button>
                </div>
            </div>

            {/* Search Overlay */}
            <div
                className={`absolute top-full left-0 right-0 bg-white shadow-md p-4 transition-all duration-300 ${
                    isSearchOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-5 pointer-events-none"
                }`}
            >
                <div className="max-w-3xl mx-auto flex items-center">
                    <Input
                        type="search"
                        placeholder="Search for products..."
                        className="flex-1"
                        autoFocus={isSearchOpen}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSearchOpen(false)}
                        className="ml-2"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 backdrop-blur-xl z-50 p-4 transition-transform duration-300 ease-out ${
                    isMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex justify-between items-center mb-8">
                    <Link
                        href="/"
                        className="text-2xl dark:text-white text-black font-bold"
                    >
                        UPMART
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <X className="h-6 dark:text-white w-6" />
                    </Button>
                </div>
                <nav className="flex flex-col space-y-6">
                    {navItems.map((item, index) => (
                        <div
                            key={item}
                            className={`transition-all duration-300 ${
                                isMenuOpen
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-5"
                            }`}
                            style={{ transitionDelay: isMenuOpen ? `${index * 100}ms` : "0ms" }}
                        >
                            <Link
                                href={`/${item.toLowerCase()}`}
                                className="text-lg dark:text-white hover:underline font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item}
                            </Link>
                        </div>
                    ))}
                    <div
                        className={`transition-all duration-300 ${
                            isMenuOpen
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-5"
                        }`}
                        style={{ transitionDelay: isMenuOpen ? "500ms" : "0ms" }}
                    >
                        <Link
                            href="/auth"
                            className={`font-medium hover:opacity-70 transition-opacity ${isScrolled
                                    ? "dark:text-white text-black"
                                    : "dark:text-white text-black"
                                }`}
                        >
                            SignIn / SignUp
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
