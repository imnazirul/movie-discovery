"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useRef, useEffect } from "react";

export default function ModeToggle({ isScrolled }: { isScrolled: boolean }) {
  const { setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-md hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Toggle theme"
      >
        {theme === "light" ? <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> : <Moon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-md border border-border bg-popover shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
          <div className="py-1">
            <button
              onClick={() => handleThemeChange("light")}
              className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors"
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors"
            >
              Dark
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors"
            >
              System
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
