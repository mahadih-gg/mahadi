"use client";

import { ContactTilesBackground } from "@/components/contact/ContactTilesBackground";
import { AnimatedSectionHeader } from "@/components/typography/AnimatedSectionHeader";
import { AnimatedHeading } from "@/components/typography/AnimatedHeading";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CONTACT_FORM_FIELDS,
  CONTACT_LINKS,
  type ContactFormField,
} from "@/data/contact.data";
import { useContactForm } from "@/hooks/useContactForm";
import { easePower3Out } from "@/lib/motion-easing";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type FormEvent } from "react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easePower3Out },
  },
};

function FloatingInput({
  id,
  label,
  type = "text",
  placeholder,
  multiline,
}: ContactFormField) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  const isActive = focused || value.length > 0;

  const inputProps = {
    id,
    name: id,
    required: true,
    value,
    placeholder: isActive ? placeholder : "",
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setValue(e.target.value),
    className:
      "w-full resize-none bg-transparent border-b border-white/10 py-3 pt-5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary",
  };

  return (
    <div className="relative">
      <motion.label
        htmlFor={id}
        className="pointer-events-none absolute left-0 origin-left text-muted-foreground"
        animate={{
          fontSize: isActive ? "10px" : "14px",
          y: isActive ? -2 : 12,
          color: focused ? "rgba(201,209,217,0.95)" : "rgba(139,148,158,1)",
        }}
        transition={{ duration: 0.2, ease: easePower3Out }}
      >
        {label}
      </motion.label>

      {multiline ? (
        <textarea rows={4} {...inputProps} />
      ) : (
        <input type={type} {...inputProps} />
      )}
    </div>
  );
}

function HoneypotField() {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
    />
  );
}

function SocialLinks({ className }: { className?: string }) {
  return (
    <TooltipProvider delayDuration={200}>
      <ul className={cn("flex flex-wrap items-center gap-4", className)}>
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
  );
}

export default function ContactSection() {
  const reduceMotion = useReducedMotion();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const { error, isLoading, submit, reset } = useContactForm({
    onSuccess: () => {
      setShowSuccess(true);
      setFormKey((k) => k + 1);
    },
  });

  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => {
      setShowSuccess(false);
      reset();
    }, 4000);
    return () => clearTimeout(timer);
  }, [showSuccess, reset]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    await submit({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
    });
  }

  const v = reduceMotion ? undefined : "visible";
  const h = reduceMotion ? undefined : "hidden";

  return (
    <section
      id="contact"
      aria-label="Contact me"
      className="relative py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <motion.div
          variants={reduceMotion ? undefined : containerVariants}
          initial={h}
          whileInView={v}
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.p
            variants={reduceMotion ? undefined : itemVariants}
            className="text-xs font-semibold tracking-[0.25em] text-primary/70 uppercase"
          >
            Get In Touch
          </motion.p>

          <motion.div
            variants={reduceMotion ? undefined : itemVariants}
            className="mt-3"
          >
            <AnimatedSectionHeader className="w-full font-secondary text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Let&apos;s build something great
            </AnimatedSectionHeader>
          </motion.div>

          <motion.p
            variants={reduceMotion ? undefined : itemVariants}
            className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Have a project in mind or want to collaborate? Send a message and
            I&apos;ll get back to you as soon as I can.
          </motion.p>

          <motion.div
            variants={reduceMotion ? undefined : itemVariants}
            className="mt-12 overflow-hidden rounded-xl border border-white/10 bg-white/3 backdrop-blur-lg backdrop-saturate-150 md:mt-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative flex min-h-[320px] flex-col justify-between overflow-hidden p-8 md:p-10 lg:p-12">
                <ContactTilesBackground />

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at 20% 80%, rgba(88,166,255,0.12) 0%, transparent 60%)",
                  }}
                />

                <div className="relative z-10">
                  <p className="text-xs font-semibold tracking-[0.25em] text-primary/70 uppercase">
                    Connect
                  </p>
                  <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground md:text-base">
                    Prefer a direct line? Reach out through email, phone, or
                    social - I&apos;m always open to interesting conversations.
                  </p>
                </div>

                <div className="relative z-10 mt-10">
                  <SocialLinks />
                </div>
              </div>

              <div className="p-8 md:p-10 lg:p-12">
                <AnimatedHeading
                  as="h3"
                  className="mb-8 text-sm font-semibold tracking-wide text-foreground uppercase"
                >
                  Send a message
                </AnimatedHeading>

                <div className="relative">
                  <form
                    key={formKey}
                    onSubmit={handleSubmit}
                    className={cn(
                      "flex flex-col gap-8 transition-opacity duration-300",
                      showSuccess
                        ? "pointer-events-none opacity-0"
                        : "opacity-100",
                    )}
                    aria-busy={isLoading}
                  >
                    {CONTACT_FORM_FIELDS.map((field) => (
                      <FloatingInput key={field.id} {...field} />
                    ))}

                    <HoneypotField />

                    {error && !showSuccess && (
                      <p
                        className="-mt-4 text-sm text-destructive"
                        role="alert"
                        aria-live="polite"
                      >
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      {isLoading ? "Sending..." : "Send Message"}
                      <motion.span
                        className="relative"
                        animate={{ x: isLoading ? 4 : 0 }}
                      >
                        <Send className="size-4" />
                      </motion.span>
                    </Button>
                  </form>

                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: easePower3Out }}
                      >
                        <div className="flex size-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                          <Send className="size-5 text-primary" />
                        </div>
                        <p className="font-secondary text-lg font-semibold text-foreground">
                          Message sent!
                        </p>
                        <p className="text-sm text-muted-foreground">
                          I&apos;ll be in touch shortly.
                        </p>

                        <div className="mt-2 h-px w-40 overflow-hidden bg-white/10">
                          <motion.div
                            className="h-full bg-primary/60"
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ duration: 4, ease: "linear" }}
                            style={{ transformOrigin: "left" }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
