"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useRef, useEffect } from "react";

export default function ModeToggle({ isScrolled }: { isScrolled: boolean }) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  // Icon color based on scroll state
  const iconColor = isScrolled
    ? "text-gray-900 dark:text-white"
    : "text-white";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
          isScrolled
            ? "hover:bg-gray-200 dark:hover:bg-gray-800"
            : "hover:bg-white/20"
        }`}
        aria-label="Toggle theme"
      >
        {mounted && (
          <>
            {resolvedTheme === "dark" ? (
              <Moon className={`h-5 w-5 ${iconColor}`} />
            ) : (
              <Sun className={`h-5 w-5 ${iconColor}`} />
            )}
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => handleThemeChange("light")}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                resolvedTheme === "light"
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                resolvedTheme === "dark"
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                theme === "system"
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              System
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
