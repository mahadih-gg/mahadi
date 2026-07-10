"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CONTACT_LINKS } from "@/data/contact.data";
import { easePower3Out } from "@/lib/motion-easing";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easePower3Out },
  },
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer() {
  const reduceMotion = useReducedMotion();
  const year = new Date().getFullYear();
  const v = reduceMotion ? undefined : "visible";
  const h = reduceMotion ? undefined : "hidden";

  return (
    <footer
      aria-label="Site footer"
      className="relative"
    >

      <motion.div
        variants={reduceMotion ? undefined : containerVariants}
        initial={h}
        whileInView={v}
        viewport={{ once: true, margin: "-40px" }}
        className="relative mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-16"
      >
        <div className="flex flex-col gap-10 md:gap-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(214,133,33,0.08)_0%,transparent_55%)]"
          />

          <div className="flex flex-col-reverse gap-6 sm:flex-row items-center justify-center sm:items-center sm:justify-between">
            <motion.p
              variants={reduceMotion ? undefined : itemVariants}
              className="text-xs tracking-wide text-foreground/80 md:text-sm"
            >
              <span className="text-foreground/70">© {year}</span>
              <span className="mx-2 text-foreground">/</span>
              Designed &amp; built by Mahadi
            </motion.p>

            <motion.div
              variants={reduceMotion ? undefined : itemVariants}
              className="flex items-center gap-4"
            >
              <TooltipProvider delayDuration={200}>
                <ul className="flex items-center gap-2.5">
                  {CONTACT_LINKS.map((link) => {
                    const Icon = link.icon;

                    return (
                      <li key={link.href}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={link.href}
                              aria-label={link.label}
                              className={cn(
                                "inline-flex items-center justify-center rounded-full border border-white/10 p-2 text-muted-foreground",
                                "transition-colors duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary",
                              )}
                              {...(link.external
                                ? {
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                }
                                : {})}
                            >
                              <Icon className="size-3.5 md:size-4" />
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

              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Back to top"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-xs tracking-wide text-muted-foreground uppercase transition-colors duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
              >
                Top
                <ArrowUp className="size-3.5" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
