import { useEffect, useState } from "react";

export type ThemeChoice = "light" | "dark" | "system";

const STORAGE_KEY = "checkhit-theme";

/** Inlined into <head> in root.tsx so the theme applies before first paint. */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("${STORAGE_KEY}");
    var isDark = stored === "dark" || (stored !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;

function systemPrefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveTheme(choice: ThemeChoice): "light" | "dark" {
  return choice === "system" ? (systemPrefersDark() ? "dark" : "light") : choice;
}

function readStoredTheme(): ThemeChoice {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "system";
}

/** Reads/writes the user's theme choice and keeps <html class="dark"> in sync. */
export function useTheme() {
  const [theme, setThemeState] = useState<ThemeChoice>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeState(readStoredTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", resolveTheme(theme) === "dark");
  }, [theme, mounted]);

  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (mounted) {
        document.documentElement.classList.toggle("dark", systemPrefersDark());
      }
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme, mounted]);

  const setTheme = (next: ThemeChoice) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
  };

  return { theme, setTheme };
}
