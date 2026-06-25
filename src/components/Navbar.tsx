"use client";
import { MagneticButton } from "./codepen-home/magnetic-button";
import MahadiLogo from "./svg/MahadiLogo";
import UnderwaterNav from "./underwater-nav";

const Navbar = () => {

  const href = "https://drive.google.com/file/d/1y_-MxKZrohq_6p2sIckGhcPhlfK7HVl7/view";

  return (
    <div className="fixed flex justify-between items-center p-4 top-0 left-0 right-0 z-50">

      <MahadiLogo />

      <UnderwaterNav />

      <MagneticButton onClick={() => window.open(href, "_blank")}>Resume</MagneticButton>
    </div>
  );
};

export default Navbar;