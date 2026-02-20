"use client";

import { COLORS } from "../lib/constants";

interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 3 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full p-4 rounded-2xl animate-pulse"
          style={{
            backgroundColor: COLORS.cream,
            animationDelay: `${i * 100}ms`,
          }}
        >
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-full"
              style={{ backgroundColor: `${COLORS.navyMuted}30` }}
            />
            <div className="flex-1">
              <div 
                className="h-4 w-24 rounded mb-2"
                style={{ backgroundColor: `${COLORS.navyMuted}30` }}
              />
              <div 
                className="h-3 w-16 rounded"
                style={{ backgroundColor: `${COLORS.navyMuted}20` }}
              />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-2 pl-13">
            <div 
              className="h-4 w-full rounded"
              style={{ backgroundColor: `${COLORS.navyMuted}20` }}
            />
            <div 
              className="h-4 w-3/4 rounded"
              style={{ backgroundColor: `${COLORS.navyMuted}20` }}
            />
          </div>

          {/* Actions skeleton */}
          <div className="flex items-center gap-4 mt-4 pl-13">
            <div 
              className="h-6 w-16 rounded"
              style={{ backgroundColor: `${COLORS.navyMuted}20` }}
            />
            <div 
              className="h-6 w-16 rounded"
              style={{ backgroundColor: `${COLORS.navyMuted}20` }}
            />
          </div>
        </div>
      ))}

      <style jsx>{`
        .pl-13 {
          padding-left: 52px;
        }
      `}</style>
    </div>
  );
}
