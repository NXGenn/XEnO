import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Button } from "../../../../components/ui/button";

export const CustomHeroSection = (): JSX.Element => {
  const waveRef = useRef(null);

  useEffect(() => {
    if (waveRef.current) {
      gsap.to(waveRef.current, {
        y: 20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }
  }, []);

  const features = [
    {
      title: "Mint Certificates",
      description: "Transform any certificate into a secure NFT on Ethereum",
      icon: "/certificate-icon.svg",
    },
    {
      title: "Verify Instantly",
      description: "Public verification portal powered by blockchain",
      icon: "/verify-icon.svg",
    },
    {
      title: "IPFS Storage",
      description: "Permanent, decentralized certificate storage",
      icon: "/storage-icon.svg",
    },
  ];

  return (
    <section className="relative min-h-screen bg-web3-bg text-white px-6 pt-20 pb-12">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={waveRef} className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 363" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1440 27.4774C1352.73 19.8184 1122.41 49.0556 899.331 227.276C620.48 450.052 354.282 355.647 170.328 185.318C23.165 49.0556 -4.21721 8.32998 0.487081 5" 
                  stroke="#FF3B30" 
                  strokeOpacity="0.1" 
                  strokeWidth="10"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-web3-red rounded-full" />
              <span>Ethereum Powered</span>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-2 h-2 bg-web3-red rounded-full" />
              <span>IPFS Storage</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-right"
          >
            <div className="flex items-center gap-2 justify-end">
              <span>Instant Verification</span>
              <div className="w-2 h-2 bg-web3-red rounded-full" />
            </div>
            <div className="flex items-center gap-2 mt-4 justify-end">
              <span>Smart Contracts</span>
              <div className="w-2 h-2 bg-web3-red rounded-full" />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-block px-4 py-2 bg-web3-red/10 rounded-full text-web3-red text-sm mb-6">
            Blockchain Certificates
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
            Transform Certificates<br />Into Secure NFTs
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Mint, verify, and manage digital certificates on the blockchain. 
            Powered by Ethereum and IPFS for maximum security and authenticity.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              className="bg-web3-red hover:bg-web3-red/90 text-white px-8 py-3 rounded-full text-lg"
            >
              Start Minting
            </Button>
            <Button 
              variant="outline"
              className="border-web3-red text-web3-red hover:bg-web3-red/10 px-8 py-3 rounded-full text-lg"
            >
              Verify Certificate
            </Button>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-web3-card p-6 rounded-lg hover:bg-web3-hover transition-colors duration-300"
            >
              <div className="flex items-start justify-between">
                <img src={feature.icon} alt={feature.title} className="w-12 h-12" />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
              <p className="text-gray-400 mt-2">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};