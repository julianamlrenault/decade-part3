"use client";

import { ChevronLeft } from "lucide-react";

interface Props {
  progress?: number; // 0..1
  showProgress?: boolean;
  onBack?: () => void;
  topRightLabel?: string;
  children: React.ReactNode;
  variant?: "default" | "atmosphere";
}

export default function ScreenShell({
  progress = 0,
  showProgress = false,
  onBack,
  topRightLabel,
  children,
  variant = "default",
}: Props) {
  return (
    <div
      className={`min-h-screen flex flex-col ${variant === "atmosphere" ? "atmosphere" : "bg-[var(--bg)]"}`}
    >
      <div className="px-5 sm:px-8 pt-5">
        {showProgress && (
          <div className="progress-bar mb-5">
            <span style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }} />
          </div>
        )}
        <div className="flex items-center justify-between min-h-[28px]">
          <div>
            {onBack ? (
              <button onClick={onBack} className="btn-ghost !py-1 !px-2 !border-0">
                <ChevronLeft className="w-4 h-4" />
                <span className="sr-only">Back</span>
              </button>
            ) : (
              <span />
            )}
          </div>
          {topRightLabel && (
            <span className="eyebrow text-[var(--text-muted)]">{topRightLabel}</span>
          )}
          <span className="w-6" />
        </div>
      </div>

      <div className="flex-1 flex justify-center px-5 sm:px-8 pb-10">
        <div className="w-full max-w-[600px] flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
