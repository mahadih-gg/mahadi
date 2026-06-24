"use client"

import { useEffect, useRef, type ComponentProps, type ReactNode } from "react"

import { cn } from "@/lib/utils"

const lerp = (current: number, target: number, factor: number) =>
  current * (1 - factor) + target * factor

const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.hypot(x1 - x2, y1 - y2)

export type MagneticButtonProps = ComponentProps<"button"> & {
  children?: ReactNode
  triggerArea?: number
  interpolationFactor?: number
  magneticStrength?: number
}

export function MagneticButton({
  children = "Hover Me",
  className,
  triggerArea = 150,
  interpolationFactor = 0.8,
  magneticStrength = 0.3,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const domElement = buttonRef.current
    if (!domElement) return

    const mousePosition = { x: 0, y: 0 }
    const lerpingData = {
      x: { current: 0, target: 0 },
      y: { current: 0, target: 0 },
    }

    const onMouseMove = (event: MouseEvent) => {
      mousePosition.x = event.clientX
      mousePosition.y = event.clientY
    }

    let rafId = 0

    const render = () => {
      const rect = domElement.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distanceFromMouseToCenter = calculateDistance(
        mousePosition.x,
        mousePosition.y,
        centerX,
        centerY
      )

      let targetX = 0
      let targetY = 0

      if (distanceFromMouseToCenter < triggerArea) {
        domElement.dataset.focused = "true"
        targetX = (mousePosition.x - centerX) * magneticStrength
        targetY = (mousePosition.y - centerY) * magneticStrength
      } else {
        domElement.dataset.focused = "false"
      }

      lerpingData.x.target = targetX
      lerpingData.y.target = targetY

      for (const axis of ["x", "y"] as const) {
        lerpingData[axis].current = lerp(
          lerpingData[axis].current,
          lerpingData[axis].target,
          interpolationFactor
        )
      }

      domElement.style.transform = `translate(${lerpingData.x.current}px, ${lerpingData.y.current}px)`
      rafId = window.requestAnimationFrame(render)
    }

    window.addEventListener("mousemove", onMouseMove)
    rafId = window.requestAnimationFrame(render)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.cancelAnimationFrame(rafId)
      domElement.style.transform = ""
      domElement.dataset.focused = "false"
    }
  }, [triggerArea, interpolationFactor, magneticStrength])

  return (
    <button
      ref={buttonRef}
      type="button"
      data-focused="false"
      className={cn(
        "cursor-pointer rounded-full border-2 border-primary bg-transparent text-sm md:text-base px-3 md:px-6 py-2 text-primary font-secondary transition-all duration-200",
        "hover:bg-primary hover:text-primary-foreground",
        "data-[focused=true]:bg-primary data-[focused=true]:text-primary-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export type MagneticButtonSectionProps = ComponentProps<"section"> & {
  children?: ReactNode
}

export function MagneticButtonSection({
  children,
  className,
  ...props
}: MagneticButtonSectionProps) {
  return (
    <section
      className={cn("flex min-h-screen items-center justify-center", className)}
      {...props}
    >
      {children}
    </section>
  )
}
