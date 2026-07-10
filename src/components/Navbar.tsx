"use client";

import { usePreloader } from "@/context/preloader-context";
import { easePower3Out } from "@/lib/motion-easing";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { MagneticButton } from "./codepen-home/magnetic-button";
import MahadiLogo from "./svg/MahadiLogo";
import UnderwaterNav from "./underwater-nav";

const Navbar = () => {
  const { isComplete } = usePreloader();
  const reduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const href = "https://drive.google.com/file/d/1y_-MxKZrohq_6p2sIckGhcPhlfK7HVl7/view";

  const shouldShow = isComplete || reduceMotion;

  return (
    <motion.div
      initial={{ opacity: 0, y: -28 }}
      animate={shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: -28 }}
      transition={{
        duration: reduceMotion ? 0 : 0.45,
        delay: reduceMotion ? 0 : 0.15,
        ease: easePower3Out,
      }}
      className="fixed top-0 right-0 left-0 z-[100] flex items-center justify-between px-4 py-4 md:px-[58px]"
    >
      <div className={cn("size-10 md:size-12 p-2 flex items-center justify-center transition-all duration-500", isScrolled && " bg-background/70 backdrop-blur-md rounded-full transition-all duration-500")}>
        <MahadiLogo className={cn("transition-all duration-500", isScrolled && "w-6 md:w-7 transition-all duration-500")} />
      </div>

      <UnderwaterNav isScrolled={isScrolled} />

      <MagneticButton
        onClick={() => window.open(href, "_blank")}
        className={cn(isScrolled && "bg-background/70 backdrop-blur-md")}
      >
        Resume
      </MagneticButton>
    </motion.div>
  );
};

export default Navbar;
