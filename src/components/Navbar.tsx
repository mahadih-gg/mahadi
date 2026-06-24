"use client";
import { MagneticButton } from "./codepen-home/magnetic-button";
import MahadiLogo from "./svg/MahadiLogo";
import UnderwaterNav from "./underwater-nav";

const Navbar = () => {
  return (
    <div className="fixed flex justify-between items-center p-4 top-0 left-0 right-0 z-50">

      <UnderwaterNav />

      <MahadiLogo />

      <MagneticButton>Resume</MagneticButton>
    </div>
  );
};

export default Navbar;