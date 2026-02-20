import { Home, Plus, Menu } from "lucide-react";
import QRCode from "qrcode";

// Colors
export const COLORS = {
  navy: "#0D1B2A",
  navyDark: "#0A1520",
  navyText: "#0D1B2A",
  navyMuted: "#64748B",
  accent: "#64748B",
  yellow: "#F5A623",
  white: "#FFFFFF",
  cream: "#FAF8F5",
  offWhite: "#F8F7F4",
  gray: {
    100: "#F5F5F0",
    500: "#6B7280",
    600: "#4B5563",
  }
};

// Navigation items - 3 icons only
export const NAV_ITEMS = [
  { id: "feed", icon: Home, label: "Feed" },
  { id: "compose", icon: Plus, label: "Post", isSpecial: true },
  { id: "menu", icon: Menu, label: "Menu" },
];

// Content filter segments
export const CONTENT_FILTERS = [
  { id: "live", label: "Live", icon: "", isLive: true },
  { id: "hot", label: "Hot", icon: "🔥" },
  { id: "alerts", label: "Alerts", icon: "🚨" },
  { id: "deals", label: "Local Deals", icon: "🏪" },
];

// Helper to format time - available globally
export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
};

// Categorization keywords
export const ALERT_KEYWORDS = ['tornado', 'storm', 'warning', 'emergency', 'evacuate', 'flooding', 
  'power out', 'outage', 'accident', 'road closed', 'fire', 'shooting', 'missing', 
  'amber alert', 'shelter', 'flood', 'hurricane', 'earthquake', 'danger', 'urgent'];

export const DEALS_KEYWORDS = ['deal', 'discount', 'special', 'sale', 'off', 'free', 'happy hour', 
  'open', 'closed', 'hours', 'giveaway', 'promo', 'coupon', 'free', 'bogo', 'clearance'];

// Auto-categorize message content
export const categorizeMessage = (content: string, manualFlag?: string | null, isBusiness?: boolean): string => {
  const lower = content.toLowerCase();
  
  if (manualFlag === 'alert' || ALERT_KEYWORDS.some(kw => lower.includes(kw))) {
    return 'alerts';
  }
  if (manualFlag === 'business' || isBusiness || DEALS_KEYWORDS.some(kw => lower.includes(kw))) {
    return 'deals';
  }
  return 'live';
};

// Check if post qualifies as "Hot" (5+ likes OR 3+ tips within 2 hours)
export const isHotPost = (likes: number, tips: number, createdAt: string): boolean => {
  const hoursSincePost = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  if (hoursSincePost > 2) return false;
  return likes >= 5 || tips >= 3;
};

// Generate QR code for profile
export const generateQRCode = async (username: string): Promise<string> => {
  try {
    const url = `https://yallwall.app/u/${username}`;
    return await QRCode.toDataURL(url, { width: 400, margin: 2 });
  } catch (err) {
    console.error('QR generation failed:', err);
    return '';
  }
};

// Sample messages
export const SAMPLE_MESSAGES = [
  { 
    id: 1, 
    user: "Sarah M.", 
    avatar: "SM",
    message: "Storm warning for east side everyone! Stay safe! 🌪️", 
    time: "2m ago",
    likes: 12,
    tips: 3,
    location: "Boyce, LA",
    isHot: true,
    category: 'alerts',
    replies: [
      { user: "Mike T.", message: "Thanks for the heads up!", time: "1m ago" },
      { user: "Jessica K.", message: "Staying inside! 🏠", time: "30s ago" },
      { user: "Tom W.", message: "Which part of east side?", time: "45s ago" },
    ]
  },
  { 
    id: 2, 
    user: "Mike T.", 
    avatar: "MT",
    message: "Best tacos I've ever had at Maria's on 6th Street right now! The line is long but worth it 🌮", 
    time: "5m ago",
    likes: 8,
    tips: 5,
    category: 'live',
    replies: [],
  },
  { 
    id: 3, 
    user: "Jessica K.", 
    avatar: "JK",
    message: "Lost my brown lab near Lamar & 6th, answers to Max! Call (512) 555-0123", 
    time: "12m ago",
    likes: 24,
    tips: 8,
    isImportant: true,
    category: 'alerts',
    replies: [
      { user: "Tom W.", message: "What area specifically?", time: "5m ago" },
      { user: "Lisa P.", message: "I saw a brown dog near the park!", time: "2m ago" },
    ]
  },
  { 
    id: 4, 
    user: "Maria's Cantina",
    avatar: "MC", 
    isBusiness: true,
    category: 'deals',
    message: "🎉 GIVEAWAY: First person to name our signature salsa wins dinner for 2! Comment below 👇",
    time: "Sponsored",
    likes: 45,
    tips: 12,
    replies: [
      { user: "David R.", message: "Spicy Verde!", time: "2m ago" },
      { user: "Lisa P.", message: "Mango Habanero?", time: "1m ago" },
      { user: "John D.", message: "Chipotle Lime?", time: "30s ago" },
    ],
  },
  { 
    id: 5, 
    user: "David R.", 
    avatar: "DR",
    category: 'alerts',
    message: "Traffic is backed up on I-35 Northbound from Riverside to MLK. Accident cleared but delays remain.", 
    time: "15m ago",
    likes: 15,
    tips: 2,
    replies: [],
  },
  { 
    id: 6, 
    user: "Lisa P.", 
    avatar: "LP",
    category: 'deals',
    message: "Farmers market at Republic Square is open until 2pm! Fresh strawberries and homemade bread 🍓🥖", 
    time: "18m ago",
    likes: 6,
    tips: 1,
    replies: [],
  },
];
