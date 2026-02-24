import { useState, useEffect } from "react";

export default function useThemeMode() {
  const THEME_KEY = "theme";
  const MANUAL_KEY = "manualThemeSet"; // New key to track manual setting

  // State to track if the user has manually toggled the theme
  const [isManual, setIsManual] = useState(
    () => localStorage.getItem(MANUAL_KEY) === "true"
  );
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem(THEME_KEY);

    // 1. If a saved mode exists, use it.
    if (savedMode) {
      return savedMode;
    }

    // 2. Fallback to system preference if no saved key is found
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
  });

  // Effect 1: Handles state -> side effects (Save to storage and apply CSS class)
  useEffect(() => {
    // 1. Save the current mode using the standardized key
    localStorage.setItem(THEME_KEY, mode);

    // 2. Save the manual flag
    localStorage.setItem(MANUAL_KEY, isManual ? "true" : "false");

    // 3. Apply the class to the root element for Tailwind CSS
    document.documentElement.classList.toggle("dark", mode === "dark");

    setLoading(false);
  }, [mode, isManual]); // Added isManual dependency

  // Effect 2: Handles external events -> state change (Real-time sync)
  useEffect(() => {
    // --------------------------------------------------------
    // 1. Listen for cross-tab/window synchronization (storage event)
    // --------------------------------------------------------
    const handleStorageChange = (event) => {
      // Check for theme change
      if (event.key === THEME_KEY && event.newValue && event.newValue !== mode) {
        setMode(event.newValue);
      }
      // Check for manual flag change (syncing manual state across tabs)
      if (event.key === MANUAL_KEY) {
        setIsManual(event.newValue === "true");
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // --------------------------------------------------------
    // 2. Listen for system preference changes (e.g., user toggles dark mode in OS settings)
    // --------------------------------------------------------
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemModeChange = (e) => {
      // 💡 Crucial change: Only follow the system setting if the user has NOT set a manual preference.
      if (!isManual) {
        const newSystemMode = e.matches ? 'dark' : 'light';
        setMode(newSystemMode);
      }
    };

    mediaQuery.addEventListener('change', handleSystemModeChange);

    // Cleanup function: remove listeners when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      mediaQuery.removeEventListener('change', handleSystemModeChange);
    };
    // Disabling the dependency warning since we only want this to run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isManual]); // isManual is now a dependency to ensure we use the latest value in the listener

  const toggleMode = () => {
    setLoading(true);
    // 💡 When the user toggles, mark it as a manual choice
    setIsManual(true);
    setMode(prev => (prev === "light" ? "dark" : "light"));
  };

  return { mode, toggleMode, loading };
}