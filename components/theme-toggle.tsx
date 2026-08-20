"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-xl w-9 h-9 text-muted-foreground"
        aria-label="Toggle theme"
      >
        <Laptop className="h-4 w-4" />
      </Button>
    );
  }

  const handleNextTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  const getTitle = () => {
    if (theme === "system") {
      return `Theme: System (${systemTheme || "auto"}) - Click for Light`;
    }
    if (theme === "light") {
      return "Theme: Light - Click for Dark";
    }
    return "Theme: Dark - Click for System";
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleNextTheme}
      title={getTitle()}
      className="rounded-xl w-9 h-9 text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "system" ? (
        <Laptop className="h-4 w-4" />
      ) : theme === "light" ? (
        <Sun className="h-4 w-4 text-amber-500" />
      ) : (
        <Moon className="h-4 w-4 text-sky-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
