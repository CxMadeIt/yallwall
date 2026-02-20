// Utility functions for YallWall

/**
 * Format a date string into a relative time string
 * e.g., "2m ago", "1h ago", "Just now"
 */
export const formatTime = (dateString: string): string => {
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

/**
 * Truncate text with ellipsis if it exceeds max length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Get initials from a name (first 2 characters, uppercase)
 */
export const getInitials = (name: string): string => {
  return name.substring(0, 2).toUpperCase();
};

/**
 * Debounce function to limit how often a function can fire
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function to limit execution to once per wait period
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Trigger haptic feedback if available (mobile devices)
 * @param duration - Duration in milliseconds
 */
export const triggerHaptic = (duration: number = 50): void => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(duration);
  }
};

/**
 * Check if device is online
 */
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

// Keywords for auto-categorization
const ALERT_KEYWORDS = [
  'tornado', 'storm', 'warning', 'emergency', 'evacuate', 'flooding',
  'power out', 'outage', 'accident', 'road closed', 'fire', 'shooting', 'missing',
  'amber alert', 'shelter', 'flood', 'hurricane', 'earthquake', 'danger', 'urgent'
];

const DEALS_KEYWORDS = [
  'deal', 'discount', 'special', 'sale', 'off', 'free', 'happy hour',
  'open', 'closed', 'hours', 'giveaway', 'promo', 'coupon', 'bogo', 'clearance'
];

/**
 * Auto-categorize message content based on keywords
 * @returns 'alerts' | 'deals' | 'live'
 */
export const categorizeMessage = (
  content: string,
  manualFlag?: string | null,
  isBusiness?: boolean
): 'alerts' | 'deals' | 'live' => {
  const lower = content.toLowerCase();
  
  if (manualFlag === 'alert' || ALERT_KEYWORDS.some(kw => lower.includes(kw))) {
    return 'alerts';
  }
  if (manualFlag === 'business' || isBusiness || DEALS_KEYWORDS.some(kw => lower.includes(kw))) {
    return 'deals';
  }
  return 'live';
};

/**
 * Check if post qualifies as "Hot" (5+ likes OR 3+ tips within 2 hours)
 */
export const isHotPost = (
  likes: number,
  tips: number,
  createdAt: string
): boolean => {
  const hoursSincePost = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  if (hoursSincePost > 2) return false;
  return likes >= 5 || tips >= 3;
};

/**
 * Format number with commas for thousands
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
