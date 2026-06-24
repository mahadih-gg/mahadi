"use client"

import Link from "next/link"
import { useId, type ReactNode } from "react"

import { cn } from "@/lib/utils"

export type GlowButtonProps = {
  children?: ReactNode
  href?: string | URL
  className?: string
  target?: string
}

export function GlowButton({
  children,
  href,
  target,
  className,
}: GlowButtonProps) {
  const id = useId().replace(/:/g, "")
  const filters = {
    unopaq: `unopaq-${id}`,
    unopaq2: `unopaq2-${id}`,
    unopaq3: `unopaq3-${id}`,
  }

  return (
    <Link
      href={href || "#"}
      target={target || "_self"}
      className={cn(
        "relative mx-8 inline-block rounded-[17px] outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "group",
        className
      )}
    >
      <svg className="absolute size-0" aria-hidden>
        <filter
          width="300%"
          x="-100%"
          height="300%"
          y="-100%"
          id={filters.unopaq}
        >
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 5 0" />
        </filter>
        <filter
          width="300%"
          x="-100%"
          height="300%"
          y="-100%"
          id={filters.unopaq2}
        >
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 2 0" />
        </filter>
        <filter
          width="300%"
          x="-100%"
          height="300%"
          y="-100%"
          id={filters.unopaq3}
        >
          <feColorMatrix values="1 0 0 0.2 0 0 1 0 0.2 0 0 0 1 0.2 0 0 0 0 2 0" />
        </filter>
      </svg>

      <div className="absolute inset-[-9900%] bg-[radial-gradient(circle_at_50%_50%,#0000_0,#0000_20%,#111111aa_50%)] bg-size-[3px_3px] -z-10" />

      <div className="relative">
        <div
          className="absolute inset-0 -z-20 overflow-hidden opacity-30 transition-opacity duration-300 group-hover:opacity-50 group-active:opacity-70"
          style={{ filter: `blur(1.25em) url(#${filters.unopaq})` }}
        >
          <div
            className="glow-button-gradient absolute inset-[-150%]"
            style={{
              background:
                "linear-gradient(90deg, #ff1a99 30%, #0000 50%, #1a80ff 70%)",
            }}
          />
        </div>

        <div
          className="absolute inset-[-0.125em] -z-20 overflow-hidden opacity-30 transition-opacity duration-300 group-hover:opacity-50 group-active:opacity-70"
          style={{
            filter: `blur(0.25em) url(#${filters.unopaq2})`,
            borderRadius: "0.75em",
          }}
        >
          <div
            className="glow-button-gradient absolute inset-[-150%]"
            style={{
              background:
                "linear-gradient(90deg, #e61aff 20%, #0000 45% 55%, #1affe6 80%)",
            }}
          />
        </div>

        <div className="rounded-[17px] bg-[#0005] p-px">
          <div className="relative">
            <div
              className="absolute inset-[-2px] -z-10 overflow-hidden opacity-40 transition-opacity duration-300 group-hover:opacity-60 group-active:opacity-80 rounded-[15px]"
              style={{
                filter: `blur(2px) url(#${filters.unopaq3})`,
              }}
            >
              <div
                className="glow-button-gradient absolute inset-[-150%]"
            style={{
              background:
                "linear-gradient(90deg, #ff80cc 30%, #0000 45% 55%, #80c8ff 70%)",
            }}
              />
            </div>

            <div className="flex items-center justify-center overflow-hidden rounded-[15px] bg-[#111215] px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white whitespace-nowrap">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
