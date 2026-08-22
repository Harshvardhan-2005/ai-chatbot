import { Moon, Sun } from "lucide-react";
import { useRef } from "react";

import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../lib/utils";

function ThemeToggle({ className }) {
  const { isDark, toggleTheme } = useTheme();
  const buttonRef = useRef(null);

  function handleClick() {
    const rect = buttonRef.current?.getBoundingClientRect();

    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : null;

    toggleTheme(origin);
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={cn(
        "relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Sun
        size={16}
        strokeWidth={1.8}
        className={cn(
          "absolute transition-all duration-300 ease-out",
          isDark
            ? "-rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100",
        )}
      />

      <Moon
        size={16}
        strokeWidth={1.8}
        className={cn(
          "absolute transition-all duration-300 ease-out",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0",
        )}
      />
    </button>
  );
}

export default ThemeToggle;
