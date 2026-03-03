"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggler() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // If theme is not set yet, fallback to "dark" visually to prevent flash of wrong icon
    const currentTheme = theme || "dark";

    return (
        <button
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200 outline-none"
            aria-label="Toggle Theme"
        >
            {currentTheme === "dark" ? (
                <Sun className="h-5 w-5 text-gray-200" />
            ) : (
                <Moon className="h-5 w-5 text-gray-800" />
            )}
        </button>
    );
}
