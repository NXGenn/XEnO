import { ethers } from "ethers";

let provider: ethers.providers.Web3Provider | null = null;

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask to connect your wallet.");
    }

    // Check if MetaMask is locked
    const accounts = await window.ethereum.request({ 
      method: 'eth_accounts'
    });
    
    if (accounts.length === 0) {
      // Request account access if needed
      await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
    }

    // Initialize provider
    provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Get the signer
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    try {
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.utils.formatEther(balance);
      return {
        address,
        balance: (+formattedBalance).toFixed(4),
      };
    } catch (balanceError) {
      console.warn('Failed to fetch balance:', balanceError);
      return {
        address,
        balance: "0.0000",
      };
    }
  } catch (error) {
    console.error('Wallet connection error:', error);
    
    // Handle specific MetaMask error codes
    if (error?.code === 4001) {
      throw new Error("Connection rejected. Please approve the MetaMask connection request.");
    } else if (error?.code === -32002) {
      throw new Error("Please unlock MetaMask and approve the pending connection request.");
    } else if (error?.code === -32603) {
      throw new Error("MetaMask is locked. Please unlock your wallet and try again.");
    } else if (error?.message?.includes('already processing')) {
      throw new Error("A connection request is already pending. Please check MetaMask.");
    } else if (!window.ethereum) {
      throw new Error("Please install MetaMask to connect your wallet.");
    } else {
      throw new Error("Failed to connect to wallet. Please ensure MetaMask is unlocked and try again.");
    }
  }
};

export const disconnectWallet = async () => {
  provider = null;
  return Promise.resolve();
};

// Listen for account changes
if (typeof window !== 'undefined' && window.ethereum) {
  window.ethereum.on('accountsChanged', () => {
    // Reload the page when accounts change
    window.location.reload();
  });

  window.ethereum.on('chainChanged', () => {
    // Reload the page when the chain changes
    window.location.reload();
  });
}

// Add types for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string, params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}