"use client"

import type React from "react"

import { motion } from "motion/react"
import Image from "next/image"
import { GlowButton } from "./glow-button"
import HeroBG from "./hero-bg"

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
    <HeroBG>
      <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12">
        <div className="flex justify-between items-center">
          <nav className="text-left flex items-start gap-x-4">
            {navLinks.map((link) => (
              <NavLink key={link.text} href={link.href}>
                {link.text}
              </NavLink>
            ))}
          </nav>

          <div className="shrink-0">
            <GlowButton href="https://drive.google.com/file/d/1y_-MxKZrohq_6p2sIckGhcPhlfK7HVl7/view?usp=sharing" target="_blank" className="mx-0">
              Resume
            </GlowButton>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end">
          <div>
            <h1
              className="text-white block mb-2 text-4xl md:text-5xl lg:text-[84px] font-black font-secondary"
            >
              MAHADI HASAN
            </h1>
            <p className="text-white block mb-2 text-xl md:text-2xl lg:text-3xl leading-tight max-w-3xl">
              Experienced
              <motion.span className="text-shadow-accent"
                style={{ textShadow: "0 0 20px rgba(255,255,255,1)" }}>
                {" "}front-end engineer {" "}
              </motion.span>
              focused on building
              accessible and engaging digital experiences.
            </p>
            <p></p>
          </div>

          <div className="absolute right-0 bottom-0 h-[90%] w-1/2">
            <div
              className="relative size-full mix-blend-soft-light"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 32%, black 100%), linear-gradient(to top, transparent 0%, black 42%, black 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 32%, black 100%), linear-gradient(to top, transparent 0%, black 42%, black 100%)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              }}
            >
              <Image
                src="/assets/images/profile.webp"
                alt="Mahadi Hasan"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </HeroBG>
  )
}
