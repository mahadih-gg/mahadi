"use client";

import { RealisticFogBackground } from "@/components/realistic-fog-background";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { HiOutlineEnvelope, HiOutlinePhone } from "react-icons/hi2";
import { IconType } from "react-icons/lib";


type ContactLink = {
  label: string;
  href: string;
  icon: IconType;
  external?: boolean;
};

const HERO_CONTACT_LINKS: ContactLink[] = [
  {
    label: "mahadih.dev@gmail.com",
    href: "mailto:mahadih.dev@gmail.com",
    icon: HiOutlineEnvelope,
  },
  {
    label: "+8801856878150",
    href: "tel:+8801856878150",
    icon: HiOutlinePhone,
  },
  {
    label: "github.com/mahadih-gg",
    href: "https://github.com/mahadih-gg",
    icon: FaGithub,
    external: true,
  },
  {
    label: "linkedin.com/in/mahadih2",
    href: "https://linkedin.com/in/mahadih2",
    icon: FaLinkedin,
    external: true,
  },
];


export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLHeadingElement>(null);
  const lastNameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const fogOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const revealTargets = [
        profileRef.current,
        firstNameRef.current,
        lastNameRef.current,
        taglineRef.current,
        contactRef.current,
        fogOverlayRef.current,
      ];
      if (reducedMotion) {
        gsap.set(revealTargets, { opacity: 1, x: 0, y: 0, scale: 1 });
        return;
      }

      gsap.set(profileRef.current, { opacity: 0, y: 48, scale: 1.04 });
      gsap.set(firstNameRef.current, { opacity: 0, x: -36, y: 24 });
      gsap.set(lastNameRef.current, { opacity: 0, x: 36, y: 24 });
      gsap.set(taglineRef.current, { opacity: 0, y: 20 });
      gsap.set(contactRef.current, { opacity: 0, y: 20 });
      gsap.set(fogOverlayRef.current, { opacity: 1 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(
        fogOverlayRef.current,
        {
          opacity: 0,
          duration: 2.8,
          ease: "power2.inOut",
        },
        0,
      )
        .to(
          profileRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 2,
            ease: "power3.out",
          },
          0.5,
        )
        .to(
          firstNameRef.current,
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.4,
            ease: "power3.out",
          },
          1.1,
        )
        .to(
          lastNameRef.current,
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.4,
            ease: "power3.out",
          },
          1.1,
        )
        .to(
          taglineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          1.45,
        )
        .to(
          contactRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          1.45,
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-background"
      aria-label="Hero"
    >
      <RealisticFogBackground className="z-1" />

      <div
        ref={profileRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-5 flex items-end justify-center opacity-0"
      >
        <div
          className="relative h-[95vh] w-fit max-w-[96vw]"
          style={{
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.25) 8%, rgba(0,0,0,0.85) 28%, black 48%)",
            maskImage:
              "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.25) 8%, rgba(0,0,0,0.85) 28%, black 48%)",
          }}
        >
          <Image
            src="/assets/images/profile.webp"
            alt="Mahadi Hasan"
            width={1121}
            height={1401}
            priority
            className="block h-full w-auto min-w-full object-cover md:object-contain object-bottom"
          />
        </div>
      </div>

      <div className="absolute inset-x-6 bottom-8 z-15 flex flex-col items-center gap-4 text-center md:inset-x-12 md:bottom-12 md:grid md:grid-cols-2 md:items-end md:gap-x-8 md:gap-y-5 md:text-left">
        <div className="flex flex-wrap items-baseline justify-center gap-x-[0.2em] md:contents">
          <h1
            ref={firstNameRef}
            className="font-secondary text-[clamp(4.5rem,8vw,9rem)] leading-[0.95] font-bold tracking-tight text-foreground opacity-0"
          >
            Mahadi
          </h1>

          <h2
            ref={lastNameRef}
            className="font-secondary text-[clamp(4.5rem,8vw,9rem)] leading-[0.95] font-bold tracking-tight text-foreground opacity-0 md:text-right"
          >
            Hasan
          </h2>
        </div>

        <p
          ref={taglineRef}
          className="mx-auto max-w-lg leading-relaxed text-muted-foreground opacity-0 text-base md:mx-0 md:text-xl"
        >
          Experienced <span className="font-medium text-white">front-end engineer</span> focused on building accessible and engaging digital experiences.
        </p>

        <nav
          ref={contactRef}
          aria-label="Contact links"
          className="opacity-0 md:justify-self-end"
        >
          <TooltipProvider delayDuration={200}>
            <ul className="flex items-center justify-center gap-4 md:justify-start">
              {HERO_CONTACT_LINKS.map((link) => {
                const Icon = link.icon;

                return (
                  <li key={link.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={link.href}
                          aria-label={link.label}
                          className="inline-flex items-center justify-center rounded-full border border-muted-foreground/20 p-2.5 text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:bg-muted-foreground/10 hover:text-primary"
                          {...(link.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          <Icon className="size-4 md:size-5" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={4}>
                        {link.label}
                      </TooltipContent>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </TooltipProvider>
        </nav>
      </div>

      <div
        ref={fogOverlayRef}
        className="pointer-events-none absolute inset-0 z-20 bg-background/70 backdrop-blur-[2px]"
        aria-hidden
      />
    </section>
  );
}
