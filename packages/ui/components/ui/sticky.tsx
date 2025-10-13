"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface StickyProps {
  children: ReactNode;
  offset?: number; // Distance from top when stuck
  className?: string;
  stickyClassName?: string; // Additional classes when stuck
  zIndex?: number;
}

export const Sticky = ({
  children,
  offset = 64,
  className = "",
  stickyClassName = "",
  zIndex = 30,
}: StickyProps) => {
  const [isFixed, setIsFixed] = useState(false);
  const [originalTop, setOriginalTop] = useState(0);
  const [originalRect, setOriginalRect] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();

        if (!isFixed && rect.top <= offset) {
          setOriginalTop(rect.top + window.scrollY);
          setOriginalRect({ left: rect.left, width: rect.width });
          setIsFixed(true);
        } else if (isFixed && window.scrollY <= originalTop - offset) {
          setIsFixed(false);
        }
      }
    };

    // Set initial position
    if (elementRef.current && originalTop === 0) {
      const rect = elementRef.current.getBoundingClientRect();
      setOriginalTop(rect.top + window.scrollY);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFixed, originalTop, offset]);

  return (
    <>
      {/* Placeholder to maintain layout when fixed */}
      {isFixed && (
        <div ref={placeholderRef} className={className}>
          <div style={{ visibility: "hidden" }}>{children}</div>
        </div>
      )}

      {/* Actual element */}
      <div
        ref={elementRef}
        className={`transition-all duration-200 ${className} ${
          isFixed ? `fixed ${stickyClassName}` : ""
        }`}
        style={
          isFixed && originalRect
            ? {
                top: `${offset}px`,
                zIndex,
                left: `${originalRect.left}px`,
                width: `${originalRect.width}px`,
              }
            : {}
        }
      >
        {children}
      </div>
    </>
  );
};
