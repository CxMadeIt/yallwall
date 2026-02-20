// Color palette for YallWall
export const COLORS = {
  navy: "#0D1B2A",
  navyDark: "#0A1520",
  navyText: "#0D1B2A",
  navyMuted: "#64748B",
  accent: "#64748B", // Will be overridden by yellow for primary actions
  yellow: "#F5A623",
  amber: "#F5A623",
  white: "#FFFFFF",
  cream: "#FAF8F5",
  offWhite: "#F8F7F4",
  coral: "#FF6B4A",
  green: "#22C55E",
  gray: {
    100: "#F5F5F0",
    500: "#6B7280",
    600: "#4B5563",
  }
};

// Navigation items
export const NAV_ITEMS = [
  { id: "feed", icon: "Home", label: "Feed" },
  { id: "compose", icon: "Plus", label: "Post", isSpecial: true },
  { id: "menu", icon: "Menu", label: "Menu" },
];

// Content filter tabs
export const CONTENT_FILTERS = [
  { id: "live", label: "Live", icon: "", isLive: true },
  { id: "hot", label: "Hot", icon: "🔥" },
  { id: "alerts", label: "Alerts", icon: "🚨" },
  { id: "deals", label: "Local Deals", icon: "🏪" },
];

// Demo mode check
export const isDemoMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('yallwall_demo_mode') === 'true';
};

export const setDemoMode = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  if (enabled) {
    localStorage.setItem('yallwall_demo_mode', 'true');
  } else {
    localStorage.removeItem('yallwall_demo_mode');
  }
};
