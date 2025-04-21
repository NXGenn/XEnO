import React from "react";
import { Button } from "../../../../components/ui/button";

export const FooterSection = (): JSX.Element => {
  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "Mint Certificate", href: "#" },
        { name: "Verify Certificate", href: "#" },
        { name: "For Institutions", href: "#" },
        { name: "Pricing", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "API Reference", href: "#" },
        { name: "Smart Contracts", href: "#" },
        { name: "IPFS Guide", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-web3-bg border-t border-web3-card">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Logo and social links */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/logo.svg" alt="Xeno" className="w-8 h-8" />
              <span className="text-white text-xl font-bold">Xeno</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Transform your certificates into secure, verifiable NFTs on the blockchain.
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="w-10 h-10 p-0 rounded-full border-web3-red/20 hover:bg-web3-red/10"
              >
                <img src="/twitter.svg" alt="Twitter" className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="w-10 h-10 p-0 rounded-full border-web3-red/20 hover:bg-web3-red/10"
              >
                <img src="/discord.svg" alt="Discord" className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="w-10 h-10 p-0 rounded-full border-web3-red/20 hover:bg-web3-red/10"
              >
                <img src="/github.svg" alt="GitHub" className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-web3-red transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-web3-card">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Xeno. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-web3-red text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-web3-red text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};