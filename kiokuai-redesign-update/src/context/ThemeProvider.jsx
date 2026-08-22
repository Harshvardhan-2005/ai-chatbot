import { useCallback, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";

import ThemeContext from "./themeContext";

const STORAGE_KEY = "kiokuai_theme";

function getPreferredTheme() {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeClass(theme) {
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getPreferredTheme);

  useEffect(() => {
    applyThemeClass(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Toggle theme with a genie-like circular reveal, expanding outward
  // from the point the user clicked (e.g. the toggle button).
  const toggleTheme = useCallback(
    (origin) => {
      const next = theme === "dark" ? "light" : "dark";

      const originX = origin?.x ?? window.innerWidth - 32;
      const originY = origin?.y ?? 32;

      const supportsViewTransition =
        typeof document !== "undefined" &&
        typeof document.startViewTransition === "function" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!supportsViewTransition) {
        setTheme(next);
        return;
      }

      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setTheme(next);
        });
      });

      transition.ready.then(() => {
        const endRadius = Math.hypot(
          Math.max(originX, window.innerWidth - originX),
          Math.max(originY, window.innerHeight - originY),
        );

        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${originX}px ${originY}px)`,
              `circle(${endRadius}px at ${originX}px ${originY}px)`,
            ],
          },
          {
            duration: 620,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      });
    },
    [theme],
  );

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      toggleTheme,
    }),
    [theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
