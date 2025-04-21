import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";

export const AccordionSection = (): JSX.Element => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const faqItems = [
    {
      question: "How does certificate minting work?",
      answer: "Upload your certificate, provide necessary details, and our platform converts it into an NFT using Ethereum smart contracts. Each certificate gets a unique token ID and is stored permanently on IPFS.",
    },
    {
      question: "What types of certificates can I mint?",
      answer: "Any type of certificate including academic degrees, professional certifications, course completions, and licenses. We support various file formats including PDF, JPG, and PNG.",
    },
    {
      question: "How can others verify my certificates?",
      answer: "Anyone can verify certificates through our public verification portal by entering the certificate's unique token ID or scanning its QR code. The verification process checks the blockchain to confirm authenticity.",
    },
    {
      question: "What blockchain network do you use?",
      answer: "We use the Ethereum network for maximum security and widespread adoption. We're also exploring integration with other networks like Polygon for lower gas fees.",
    },
    {
      question: "How secure are the minted certificates?",
      answer: "Extremely secure. Certificates are stored on IPFS and the blockchain, making them immutable and permanently accessible. We use industry-standard encryption for all data handling.",
    },
  ];

  return (
    <section className="w-full py-24 px-6 md:px-16 bg-web3-card">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-web3-red text-sm font-semibold uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white">
            Common Questions
          </h2>
          <p className="mt-4 text-gray-400">
            Everything you need to know about our blockchain certificate platform
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-web3-red/20 rounded-lg overflow-hidden bg-web3-bg"
              >
                <AccordionTrigger className="px-6 py-4 text-white hover:text-web3-red transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};