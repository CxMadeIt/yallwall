import { useCallback } from "react";

export function useHaptics() {
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const success = useCallback(() => vibrate([10, 30, 10]), [vibrate]);
  const error = useCallback(() => vibrate([50, 30, 50]), [vibrate]);
  const light = useCallback(() => vibrate(5), [vibrate]);
  const medium = useCallback(() => vibrate(15), [vibrate]);
  const heavy = useCallback(() => vibrate(30), [vibrate]);

  return { vibrate, success, error, light, medium, heavy };
}
