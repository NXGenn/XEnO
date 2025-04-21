import React from "react";
import { Button } from "../../../../components/ui/button";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export const HeroImageSection = (): JSX.Element => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="flex flex-col w-full items-center justify-center gap-8 px-4 md:px-6 py-20 md:py-40 overflow-hidden">
      <motion.div 
        ref={ref}
        initial={{ opacity: 0, y: 100 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-8"
      >
        <motion.img
          src="/screenshot-2025-04-05-235023-removebg-preview-1.png"
          alt="Certificate NFT Platform"
          className="w-full max-w-[800px] h-auto object-contain hover:scale-105 transition-transform duration-300"
          whileHover={{ scale: 1.05 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        <div className="flex flex-col items-center gap-2">
          <motion.h1 
            className="font-title-hero font-[number:var(--title-hero-font-weight)] text-white text-4xl md:text-[length:var(--title-hero-font-size)] text-center tracking-[var(--title-hero-letter-spacing)] leading-[var(--title-hero-line-height)] [font-style:var(--title-hero-font-style)]"
            initial={{ opacity: 0, x: -100 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Transform Certificates into NFTs
          </motion.h1>

          <motion.h2 
            className="font-subtitle font-[number:var(--subtitle-font-weight)] text-white text-2xl md:text-[length:var(--subtitle-font-size)] text-center tracking-[var(--subtitle-letter-spacing)] leading-[var(--subtitle-line-height)] [font-style:var(--subtitle-font-style)] max-w-2xl"
            initial={{ opacity: 0, x: 100 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Secure, Verifiable, and Blockchain-Powered Digital Credentials
          </motion.h2>
        </div>
      </motion.div>

      <motion.div 
        className="flex items-center justify-center gap-4"
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Button
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-lg p-3 h-auto transition-colors duration-300"
        >
          Mint Certificate
        </Button>

        <Button
          variant="default"
          className="bg-white text-black hover:bg-white/90 rounded-lg p-3 h-auto transition-colors duration-300"
        >
          Verify Certificate
        </Button>
      </motion.div>
    </section>
  );
};