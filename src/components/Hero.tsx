"use client"

import type React from "react"

import { motion } from "motion/react"

interface NavLinkProps {
  children: React.ReactNode
  href: string
}

function NavLink({ children, href }: NavLinkProps) {
  return (
    <span className="inline-block perspective-[1000px]">
      <motion.a
        href={href}
        className="relative text-gray-300 text-sm md:text-base uppercase tracking-wider font-semibold"
        initial={false}
        whileHover={{
          scale: 1.05,
          rotateX: -2,
          z: 20,
          textShadow: "0 0 20px rgba(255,255,255,0.8)",
          filter: "brightness(1.2) saturate(1.3)",
          zIndex: 10,
        }}
      >
        {children}
      </motion.a>
    </span>
  )
}

const navLinks = [
  { text: "About", href: "#about" },
  { text: "Skills", href: "#skills" },
  { text: "Projects", href: "#projects" },
  { text: "Experience", href: "#experience" },
  { text: "Contact", href: "#contact" },
]

export default function Hero() {
  return (
    <div></div>
  )
}
