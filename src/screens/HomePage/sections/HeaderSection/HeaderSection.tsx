import React from "react";
import { Button } from "../../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../../../../components/ui/navigation-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "../../../../contexts/WalletContext";

export const HeaderSection = (): JSX.Element => {
  const navigate = useNavigate();
  const { walletAddress, isConnecting, error, connect, disconnect } = useWallet();

  const navItems = [
    { text: "Mint", active: true, path: "/mint" },
    { text: "Collection", active: false, path: "/collection" },
    { text: "Verify", active: false, path: "/verify" },
    { text: "Features", active: false, path: "/#features" },
    { text: "Documentation", active: false, path: "/docs" },
    { text: "Pricing", active: false, path: "/pricing" },
  ];

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="flex items-center justify-between w-full px-6 py-4 bg-web3-bg border-none">
      <div className="flex items-center gap-12">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <img src="/logo.svg" alt="Xeno" className="w-8 h-8" />
          <span className="text-white text-xl font-bold">Xeno</span>
        </div>
        
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-8">
            {navItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                <Button
                  variant="ghost"
                  className={`${
                    item.active
                      ? "text-web3-red"
                      : "text-white hover:text-web3-red"
                  } transition-colors duration-200`}
                  onClick={() => navigate(item.path)}
                >
                  {item.text}
                </Button>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="relative">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-red-500 text-white text-sm rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {walletAddress ? (
          <div className="flex items-center gap-2">
            <span className="text-white bg-web3-card px-4 py-2 rounded-full">
              {formatAddress(walletAddress)}
            </span>
            <Button 
              onClick={disconnect}
              className="bg-web3-red hover:bg-web3-red/90 text-white px-6 py-2 rounded-full"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button 
            onClick={connect}
            disabled={isConnecting}
            className="bg-web3-red hover:bg-web3-red/90 text-white px-6 py-2 rounded-full"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </div>
    </header>
  );
};