"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Input from "./ui/Input";
import Button from "./ui/Button";
import ModeToggle from "@/Provider/ThemeToggle";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
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

    const navItems = ["Home", "Search", "About", "Contact"];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-white dark:bg-gray-900 shadow-md py-3"
                    : "bg-black/20 backdrop-blur-sm py-4"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden mr-2"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <Menu
                            className={`h-6 w-6 ${
                                isScrolled
                                    ? "text-gray-900 dark:text-white"
                                    : "text-white"
                            }`}
                        />
                    </Button>
                    <Link href="/" className="text-2xl font-bold">
                        <span
                            className={`inline-block transition-all duration-500 ${
                                isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
                            } ${
                                isScrolled
                                    ? "text-gray-900 dark:text-white"
                                    : "text-white"
                            }`}
                        >
                            MovZen
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
                                className={`font-medium hover:opacity-70 transition-opacity ${
                                    isScrolled
                                        ? "text-gray-900 dark:text-white"
                                        : "text-white"
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
                            className={`h-5 w-5 ${
                                isScrolled
                                    ? "text-gray-900 dark:text-white"
                                    : "text-white"
                            }`}
                        />
                    </Button>
                    <ModeToggle isScrolled={isScrolled} />
                </div>
            </div>

            {/* Search Overlay */}
            <div
                className={`absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-md p-4 transition-all duration-300 ${
                    isSearchOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-5 pointer-events-none"
                }`}
            >
                <div className="max-w-3xl mx-auto flex items-center">
                    <Input
                        type="search"
                        placeholder="Search for movies..."
                        className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                        autoFocus={isSearchOpen}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSearchOpen(false)}
                        className="ml-2"
                    >
                        <X className="h-5 w-5 text-gray-900 dark:text-white" />
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 bg-white dark:bg-gray-900 z-50 p-4 transition-transform duration-300 ease-out ${
                    isMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex justify-between items-center mb-8">
                    <Link
                        href="/"
                        className="text-2xl text-gray-900 dark:text-white font-bold"
                    >
                        MovZen
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <X className="h-6 w-6 text-gray-900 dark:text-white" />
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
                                className="text-lg text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary font-medium transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item}
                            </Link>
                        </div>
                    ))}
                </nav>
            </div>
        </header>
    );
}
