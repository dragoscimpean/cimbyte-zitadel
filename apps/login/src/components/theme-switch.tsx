"use client";

import { ComputerDesktopIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { ThemeMode } from "@zitadel/proto/zitadel/settings/v2/branding_settings_pb";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useThemeMode } from "./branding-context";
function getSelectedButtonStyle(isSelected: boolean): string {
  return isSelected ? "cb-btn-primary" : "cb-btn-ghost";
}

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const themeMode = useThemeMode();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Hide toggle when theme is forced to light or dark only
  if (themeMode === ThemeMode.LIGHT || themeMode === ThemeMode.DARK) {
    return null;
  }

  // themeMode is AUTO (1) or UNSPECIFIED (0): show light, system, dark options
  return (
    <div className="cb-btn-group">
      <button
        type="button"
        className={`cb-btn cb-btn-xs h-8 w-8 p-0 ${getSelectedButtonStyle(theme === "light")}`}
        onClick={() => setTheme("light")}
        aria-label="Switch to light mode"
      >
        <SunIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        className={`cb-btn cb-btn-xs h-8 w-8 p-0 ${getSelectedButtonStyle(theme === "system")}`}
        onClick={() => setTheme("system")}
        aria-label="Switch to system mode"
      >
        <ComputerDesktopIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={`cb-btn cb-btn-xs h-8 w-8 p-0 ${getSelectedButtonStyle(theme === "dark")}`}
        onClick={() => setTheme("dark")}
        aria-label="Switch to dark mode"
      >
        <MoonIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
