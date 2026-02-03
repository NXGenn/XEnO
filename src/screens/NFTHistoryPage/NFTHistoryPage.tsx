import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, CheckCheck, ExternalLink, Loader, AlertCircle, Calendar, User } from "lucide-react";
import { Button } from "../../components/ui/button";
import { HeaderSection } from "../HomePage/sections/HeaderSection/HeaderSection";
import { useWallet } from "../../contexts/WalletContext";
import { fetchCertificatesByWallet } from "../../lib/nft";

interface Certificate {
  id: string;
  name: string;
  description: string;
  issuer: string;
  issuance_date: string;
  expiry_date: string | null;
  image_url: string;
  token_id: string | null;
  contract_address: string | null;
  status: string;
  created_at: string;
}

export const NFTHistoryPage = (): JSX.Element => {
  const { walletAddress } = useWallet();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const loadCertificates = async () => {
      if (!walletAddress) {
        setError("Please connect your wallet to view your NFTs");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchCertificatesByWallet(walletAddress);
        setCertificates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load certificates");
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, [walletAddress]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500 bg-green-500/10";
      case "minting":
        return "text-blue-500 bg-blue-500/10";
      case "failed":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-yellow-500 bg-yellow-500/10";
    }
  };

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith("ipfs://")) {
      return `https://gateway.pinata.cloud/ipfs/${imageUrl.replace("ipfs://", "")}`;
    }
    return imageUrl;
  };

  return (
    <div className="min-h-screen bg-web3-bg">
      <HeaderSection />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Your NFT Collection</h1>
            <p className="text-gray-400">
              {walletAddress ? `Viewing certificates for ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect your wallet to view your certificates"}
            </p>
          </div>

          {!walletAddress ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-web3-card rounded-xl p-8 text-center"
            >
              <AlertCircle className="w-12 h-12 text-web3-red mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Please connect your wallet to view your NFT collection</p>
            </motion.div>
          ) : loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center"
            >
              <Loader className="w-8 h-8 text-web3-red animate-spin" />
              <span className="ml-3 text-gray-400">Loading your certificates...</span>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-web3-card rounded-xl p-8 text-center"
            >
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">{error}</p>
            </motion.div>
          ) : certificates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-web3-card rounded-xl p-8 text-center"
            >
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No certificates found. Start minting your first NFT certificate!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-web3-card rounded-xl overflow-hidden hover:shadow-lg hover:shadow-web3-red/20 transition-all"
                >
                  <div className="relative pb-[100%]">
                    <img
                      src={getImageUrl(cert.image_url)}
                      alt={cert.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.pexels.com/photos/6670/white-book-pages-read.jpg?auto=compress&cs=tinysrgb&w=400";
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="text-white font-semibold text-lg truncate">{cert.name}</h3>
                      <p className="text-gray-400 text-sm truncate">{cert.issuer}</p>
                    </div>

                    <div className="space-y-2 mb-4 text-xs">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(cert.issuance_date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getStatusColor(cert.status)}`}>
                      {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                    </div>

                    {cert.token_id && cert.contract_address && cert.status === "completed" && (
                      <div className="space-y-3 pt-3 border-t border-gray-700">
                        <div className="bg-web3-bg rounded p-3">
                          <p className="text-gray-400 text-xs mb-2">Token ID</p>
                          <div className="flex items-center gap-2">
                            <p className="text-white text-xs font-mono truncate flex-1">{cert.token_id}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-web3-red hover:text-web3-red/80"
                              onClick={() => copyToClipboard(cert.token_id!, cert.id)}
                            >
                              {copied === cert.id ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="bg-web3-bg rounded p-3">
                          <p className="text-gray-400 text-xs mb-2">Contract Address</p>
                          <div className="flex items-center gap-2">
                            <p className="text-white text-xs font-mono truncate flex-1">{cert.contract_address.slice(0, 6)}...{cert.contract_address.slice(-4)}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-web3-red hover:text-web3-red/80"
                              onClick={() => copyToClipboard(cert.contract_address!, `addr-${cert.id}`)}
                            >
                              {copied === `addr-${cert.id}` ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <a
                          href={`https://polygonscan.com/token/${cert.contract_address}?a=${walletAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-web3-red/10 hover:bg-web3-red/20 text-web3-red rounded px-3 py-2 text-xs transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View on PolygonScan
                        </a>
                      </div>
                    )}

                    {cert.status !== "completed" && (
                      <div className="bg-yellow-500/10 rounded p-3 text-xs text-yellow-400 border border-yellow-500/20">
                        Minting in progress... Check back soon
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};
