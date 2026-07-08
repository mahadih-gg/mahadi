"use client";

import { RealisticFogBackground } from "@/components/realistic-fog-background";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePreloader } from "@/context/preloader-context";
import { CONTACT_LINKS } from "@/data/contact.data";
import {
  easePower2InOut,
  easePower3Out,
} from "@/lib/motion-easing";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

export default function Hero() {
  const { isComplete } = usePreloader();
  const reduceMotion = useReducedMotion();
  const visible = isComplete || reduceMotion;

  const instant = reduceMotion ? { duration: 0 } : undefined;

  return (
    <section
      className="relative min-h-screen overflow-hidden isolate"
      aria-label="Hero"
    >
      <RealisticFogBackground className="z-1" />

      <motion.div
        initial={{ opacity: 0, y: 48, scale: 1.04 }}
        animate={
          visible
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 48, scale: 1.04 }
        }
        transition={
          instant ?? {
            duration: 2,
            delay: 0.5,
            ease: easePower3Out,
          }
        }
        className="pointer-events-none absolute inset-x-0 bottom-0 z-5 flex items-end justify-center"
      >
        <div
          className="relative h-[95vh] w-fit max-w-[100vw] md:max-w-[96vw]"
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
      </motion.div>

      <div className="absolute inset-x-6 bottom-8 z-15 flex flex-col items-center gap-4 text-center md:inset-x-12 md:bottom-12 md:grid md:grid-cols-2 md:items-end md:gap-x-8 md:gap-y-5 md:text-left">
        <div className="flex flex-wrap items-baseline justify-center gap-x-[1em] md:contents">
          <motion.h1
            initial={{ opacity: 0, x: -36, y: 24 }}
            animate={
              visible
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, x: -36, y: 24 }
            }
            transition={
              instant ?? {
                duration: 1.4,
                delay: 1.1,
                ease: easePower3Out,
              }
            }
            className="font-secondary text-[clamp(4.5rem,8vw,9rem)] leading-[0.95] font-bold tracking-tight text-foreground"
          >
            Mahadi
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, x: 36, y: 24 }}
            animate={
              visible
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, x: 36, y: 24 }
            }
            transition={
              instant ?? {
                duration: 1.4,
                delay: 1.1,
                ease: easePower3Out,
              }
            }
            className="font-secondary text-[clamp(4.5rem,8vw,9rem)] leading-[0.95] font-bold tracking-tight text-foreground md:text-right"
          >
            Hasan
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={
            visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={
            instant ?? {
              duration: 1.2,
              delay: 1.45,
              ease: easePower3Out,
            }
          }
          className="mx-auto max-w-lg leading-relaxed text-muted-foreground text-base md:mx-0 md:text-xl"
        >
          Experienced{" "}
          <span className="font-medium text-white">front-end engineer</span>{" "}
          focused on building accessible and engaging digital experiences.
        </motion.p>

        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={
            visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={
            instant ?? {
              duration: 1.2,
              delay: 1.45,
              ease: easePower3Out,
            }
          }
          aria-label="Contact links"
          className="md:justify-self-end"
        >
          <TooltipProvider delayDuration={200}>
            <ul className="flex items-center justify-center gap-4 md:justify-start">
              {CONTACT_LINKS.map((link) => {
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
        </motion.nav>
      </div>

      <motion.div
        initial={{ opacity: 1 }}
        animate={visible ? { opacity: 0 } : { opacity: 1 }}
        transition={
          instant ?? {
            duration: 2.8,
            delay: 0,
            ease: easePower2InOut,
          }
        }
        className="pointer-events-none absolute inset-0 z-20 bg-background/70 backdrop-blur-[2px]"
        aria-hidden
      />
    </section>
  );
}
