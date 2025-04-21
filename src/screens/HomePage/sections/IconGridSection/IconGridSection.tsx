import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Shield, FileCheck, Users, Globe, Lock, History } from "lucide-react";

export const IconGridSection = (): JSX.Element => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: Shield,
      title: "Military-Grade Security",
      description: "Advanced encryption ensures your certificates remain tamper-proof on the blockchain",
    },
    {
      icon: FileCheck,
      title: "Instant Verification",
      description: "Verify any certificate's authenticity in seconds through our public portal",
    },
    {
      icon: Users,
      title: "Institution Network",
      description: "Join a growing network of educational institutions using blockchain credentials",
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access your certificates anywhere through decentralized IPFS storage",
    },
    {
      icon: Lock,
      title: "Privacy Control",
      description: "Granular control over who can access and verify your credentials",
    },
    {
      icon: History,
      title: "Permanent Record",
      description: "All certificate transactions are permanently recorded on Ethereum",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="w-full py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-web3-red text-sm font-semibold uppercase tracking-wider">
            Why Choose Xeno
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white">
            Secure Certificate Management
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Our blockchain-powered platform offers unmatched security and verification capabilities
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-web3-card p-6 rounded-xl hover:bg-web3-hover transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-web3-red/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-web3-red" />
                </div>
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};