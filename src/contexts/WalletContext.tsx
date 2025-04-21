import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectWallet, disconnectWallet } from '../lib/wallet';

interface WalletContextType {
  walletAddress: string | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if wallet was previously connected
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const { address } = await connectWallet();
            setWalletAddress(address);
          }
        } catch (err) {
          console.debug('No previous wallet connection found');
        }
      }
    };

    checkWalletConnection();
  }, []);

  const connect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      const { address } = await connectWallet();
      setWalletAddress(address);
    } catch (err) {
      setError(err.message);
      console.error('Connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await disconnectWallet();
      setWalletAddress(null);
      setError(null);
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnecting,
        error,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}