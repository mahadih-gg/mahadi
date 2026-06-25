"use client";

import { usePreloader } from "@/context/preloader-context";
import { easePower3Out } from "@/lib/motion-easing";
import { motion, useReducedMotion } from "motion/react";
import { MagneticButton } from "./codepen-home/magnetic-button";
import MahadiLogo from "./svg/MahadiLogo";
import UnderwaterNav from "./underwater-nav";

const Navbar = () => {
  const { isComplete } = usePreloader();
  const reduceMotion = useReducedMotion();

  const href =
    "https://drive.google.com/file/d/1y_-MxKZrohq_6p2sIckGhcPhlfK7HVl7/view";

  const shouldShow = isComplete || reduceMotion;

  return (
    <motion.div
      initial={{ opacity: 0, y: -80 }}
      animate={
        shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: -80 }
      }
      transition={{
        duration: reduceMotion ? 0 : 0.8,
        delay: reduceMotion ? 0 : 0.6,
        ease: easePower3Out,
      }}
      className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between p-4"
    >
      <MahadiLogo />

      <UnderwaterNav />

      <MagneticButton onClick={() => window.open(href, "_blank")}>
        Resume
      </MagneticButton>
    </motion.div>
  );
};

export default Navbar;
