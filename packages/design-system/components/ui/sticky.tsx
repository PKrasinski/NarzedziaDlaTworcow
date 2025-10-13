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
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Function to update rect dimensions when element is fixed
  const updateRect = () => {
    if (elementRef.current && isFixed) {
      const parent = elementRef.current.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const parentStyle = window.getComputedStyle(parent);
        
        // Calculate the content area (excluding padding)
        const paddingLeft = parseFloat(parentStyle.paddingLeft) || 0;
        const paddingRight = parseFloat(parentStyle.paddingRight) || 0;
        const contentWidth = parentRect.width - paddingLeft - paddingRight;
        const contentLeft = parentRect.left + paddingLeft;
        
        setOriginalRect({ 
          left: contentLeft, 
          width: contentWidth 
        });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();

        if (!isFixed && rect.top <= offset) {
          setOriginalTop(rect.top + window.scrollY);
          
          // Calculate proper positioning considering parent padding
          const parent = elementRef.current.parentElement;
          if (parent) {
            const parentRect = parent.getBoundingClientRect();
            const parentStyle = window.getComputedStyle(parent);
            
            // Calculate the content area (excluding padding)
            const paddingLeft = parseFloat(parentStyle.paddingLeft) || 0;
            const paddingRight = parseFloat(parentStyle.paddingRight) || 0;
            const contentWidth = parentRect.width - paddingLeft - paddingRight;
            const contentLeft = parentRect.left + paddingLeft;
            
            setOriginalRect({ left: contentLeft, width: contentWidth });
          } else {
            // Fallback to element's own dimensions
            setOriginalRect({ left: rect.left, width: rect.width });
          }
          
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

  // Set up ResizeObserver to watch for parent container size changes
  useEffect(() => {
    if (elementRef.current) {
      const parentElement = elementRef.current.parentElement;
      if (parentElement && window.ResizeObserver) {
        resizeObserverRef.current = new ResizeObserver(() => {
          updateRect();
        });
        resizeObserverRef.current.observe(parentElement);
      }
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [isFixed]);

  // Update rect when isFixed state changes
  useEffect(() => {
    if (isFixed) {
      updateRect();
    }
  }, [isFixed]);

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
