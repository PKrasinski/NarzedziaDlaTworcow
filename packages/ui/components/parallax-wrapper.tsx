"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface ParallaxWrapperProps {
  children: React.ReactNode
  backgroundColor?: string
  direction?: "left" | "right"
  intensity?: number
  className?: string
}

export function ParallaxWrapper({
  children,
  backgroundColor = "#3B82F6",
  direction = "left",
  intensity = 15,
  className = "",
}: ParallaxWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return

      const rect = wrapperRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      const elementHeight = rect.height

      // Calculate if element is in viewport
      const isInViewport = elementTop < windowHeight && elementTop + elementHeight > 0

      if (isInViewport) {
        // Calculate scroll progress (0 to 1) based on element position in viewport
        const scrollProgress = Math.max(0, Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight)))

        // Calculate transform values
        const yOffset = scrollProgress * intensity
        const xOffset = direction === "left" ? -scrollProgress * intensity : scrollProgress * intensity

        setTransform({ x: xOffset, y: yOffset })
      }
    }

    // Initial calculation
    handleScroll()

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [direction, intensity])

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Animated background layer - positioned outside overflow container */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundColor,
          transform: `translate(${transform.x}px, ${transform.y}px)`,
          transition: "transform 0.1s ease-out",
        }}
      />

      {/* Content layer with overflow hidden */}
      <div className="relative overflow-hidden w-full h-full">{children}</div>
    </div>
  )
}
