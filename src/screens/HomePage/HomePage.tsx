import React from "react";
import { HeaderSection } from "./sections/HeaderSection/HeaderSection";
import { CustomHeroSection } from "./sections/CustomHeroSection/CustomHeroSection";
import { IconGridSection } from "./sections/IconGridSection/IconGridSection";
import { AccordionSection } from "./sections/AccordionSection/AccordionSection";
import { FooterSection } from "./sections/FooterSection/FooterSection";

export const HomePage = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-web3-bg">
      <HeaderSection />
      <CustomHeroSection />
      <IconGridSection />
      <AccordionSection />
      <FooterSection />
    </div>
  );
};