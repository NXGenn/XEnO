import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, Check, AlertCircle, Copy, CheckCheck, RefreshCw, ExternalLink, BookOpen } from "lucide-react";
import { Button } from "../../components/ui/button";
import { HeaderSection } from "../HomePage/sections/HeaderSection/HeaderSection";
import { useWallet } from "../../contexts/WalletContext";
import { uploadToPinata, mintWithCrossmint, checkMintingStatus } from "../../lib/nft";
import type { CertificateMetadata, MintingDetails, DeliveryMethod, NFTDetails } from "../../types/nft";

export const MintPage = (): JSX.Element => {
  const { walletAddress } = useWallet();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<CertificateMetadata>({
    name: "",
    description: "",
    issuer: "",
    issuanceDate: new Date().toISOString().split('T')[0],
    expiryDate: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('wallet');
  const [email, setEmail] = useState('');
  const [minting, setMinting] = useState(false);
  const [mintingStatus, setMintingStatus] = useState<'idle' | 'uploading' | 'minting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [nftDetails, setNftDetails] = useState<NFTDetails | null>(null);
  const [copied, setCopied] = useState<'none' | 'address' | 'tokenId'>('none');
  const [checkingStatus, setCheckingStatus] = useState(false);

  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = async (text: string, type: 'address' | 'tokenId') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied('none'), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const validateMintingDetails = (): boolean => {
    if (deliveryMethod === 'wallet' && !walletAddress) {
      setError('Please connect your wallet to mint the NFT');
      return false;
    }
    if (deliveryMethod === 'email' && !email) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleCheckStatus = async () => {
    if (!nftDetails?.mintingId) return;

    try {
      setCheckingStatus(true);
      const status = await checkMintingStatus(nftDetails.mintingId);
      setNftDetails(prev => ({ ...prev!, ...status }));
    } catch (err) {
      console.error('Error checking status:', err);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleMint = async () => {
    if (!selectedImage || !validateMintingDetails()) return;

    try {
      setMinting(true);
      setError(null);
      setMintingStatus('uploading');

      const { metadataUrl, name, image } = await uploadToPinata(selectedImage, metadata);
      
      setMintingStatus('minting');
      
      const recipient = deliveryMethod === 'wallet' ? walletAddress! : email;
      const mintResult = await mintWithCrossmint(
        metadataUrl,
        name,
        image,
        recipient,
        deliveryMethod === 'email'
      );
      
      setNftDetails(mintResult);
      setMintingStatus('success');
    } catch (err) {
      console.error('Minting error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while minting');
      setMintingStatus('error');
    } finally {
      setMinting(false);
    }
  };

  const getStatusMessage = () => {
    switch (mintingStatus) {
      case 'uploading':
        return 'Uploading to IPFS...';
      case 'minting':
        return 'Minting NFT...';
      case 'success':
        return 'Successfully minted!';
      case 'error':
        return error || 'Error minting NFT';
      default:
        return '';
    }
  };

  const isFormValid = () => {
    if (!selectedImage) return false;
    if (deliveryMethod === 'wallet' && !walletAddress) return false;
    if (deliveryMethod === 'email' && !email) return false;
    return true;
  };

  // Add automatic status checking
  useEffect(() => {
    let intervalId: number;

    if (nftDetails?.mintingId && nftDetails.status !== 'completed') {
      intervalId = window.setInterval(handleCheckStatus, 10000); // Check every 10 seconds
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [nftDetails?.mintingId, nftDetails?.status]);

  return (
    <div className="min-h-screen bg-web3-bg">
      <HeaderSection />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Mint Certificate NFT</h1>
            <p className="text-gray-400">Transform your certificate into a verifiable NFT on Ethereum</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Upload and Preview */}
            <div className="space-y-6">
              <div className="bg-web3-card rounded-xl p-6">
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    imagePreview ? 'border-web3-red' : 'border-gray-600 hover:border-web3-red'
                  } transition-colors`}
                >
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img 
                        src={imagePreview} 
                        alt="Certificate Preview" 
                        className="max-w-full h-auto rounded-lg mx-auto"
                      />
                      <Button
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                        variant="outline"
                        className="text-web3-red border-web3-red hover:bg-web3-red/10"
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <Upload className="w-12 h-12 text-web3-red mx-auto mb-4" />
                      <p className="text-white mb-2">Drop your certificate here</p>
                      <p className="text-gray-400 text-sm">Supports JPG, PNG, PDF</p>
                    </label>
                  )}
                </div>
              </div>

              {/* NFT Details After Successful Mint */}
              {mintingStatus === 'success' && nftDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-web3-card rounded-xl p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-semibold">NFT Details</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCheckStatus}
                      disabled={checkingStatus}
                      className="text-web3-red hover:text-web3-red/80"
                    >
                      <RefreshCw className={`h-4 w-4 ${checkingStatus ? 'animate-spin' : ''}`} />
                      <span className="ml-2">Check Status</span>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-web3-bg rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Status</span>
                        <span className={`text-sm ${
                          nftDetails.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
                        }`}>
                          {nftDetails.status.charAt(0).toUpperCase() + nftDetails.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {nftDetails.onChain?.tokenId && (
                      <div className="bg-web3-bg rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Token ID</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-web3-red hover:text-web3-red/80"
                            onClick={() => copyToClipboard(nftDetails.onChain.tokenId!, 'tokenId')}
                          >
                            {copied === 'tokenId' ? (
                              <CheckCheck className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-white font-mono text-sm break-all">
                          {nftDetails.onChain.tokenId}
                        </p>
                      </div>
                    )}

                    {nftDetails.onChain?.contractAddress && (
                      <div className="bg-web3-bg rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Collection Address</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-web3-red hover:text-web3-red/80"
                            onClick={() => copyToClipboard(nftDetails.onChain.contractAddress!, 'address')}
                          >
                            {copied === 'address' ? (
                              <CheckCheck className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-white font-mono text-sm break-all">
                          {nftDetails.onChain.contractAddress}
                        </p>

                        {nftDetails.onChain?.tokenId && (
                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <p className="text-gray-400 text-xs mb-3">To import this NFT to MetaMask:</p>
                            <ol className="text-gray-300 text-xs space-y-2">
                              <li className="flex gap-2">
                                <span className="text-web3-red font-semibold">1.</span>
                                <span>Open MetaMask and switch to Polygon network</span>
                              </li>
                              <li className="flex gap-2">
                                <span className="text-web3-red font-semibold">2.</span>
                                <span>Click "Import tokens" in the NFTs tab</span>
                              </li>
                              <li className="flex gap-2">
                                <span className="text-web3-red font-semibold">3.</span>
                                <span>Paste the collection address above</span>
                              </li>
                              <li className="flex gap-2">
                                <span className="text-web3-red font-semibold">4.</span>
                                <span>Enter the token ID below</span>
                              </li>
                              <li className="flex gap-2">
                                <span className="text-web3-red font-semibold">5.</span>
                                <span>Click "Import" to view your certificate NFT</span>
                              </li>
                            </ol>

                            <div className="mt-3 flex gap-2">
                              <a
                                href="https://support.metamask.io/hc/en-us/articles/360058238591"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-web3-red hover:text-web3-red/80 text-xs flex items-center gap-1"
                              >
                                <BookOpen className="h-3 w-3" />
                                MetaMask Guide
                              </a>
                              <a
                                href={`https://polygonscan.com/token/${nftDetails.onChain.contractAddress}?a=${nftDetails.onChain.contractAddress}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-web3-red hover:text-web3-red/80 text-xs flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                View on PolygonScan
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {nftDetails.transactionHash && (
                      <div className="bg-web3-bg rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Transaction Hash</span>
                          <a
                            href={`https://polygonscan.com/tx/${nftDetails.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-web3-red hover:text-web3-red/80 text-sm"
                          >
                            View on Explorer
                          </a>
                        </div>
                        <p className="text-white font-mono text-sm break-all">
                          {nftDetails.transactionHash}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Metadata Form */}
            <div className="bg-web3-card rounded-xl p-6">
              <h3 className="text-white font-semibold mb-6">Certificate Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Certificate Name</label>
                  <input
                    type="text"
                    name="name"
                    value={metadata.name}
                    onChange={handleMetadataChange}
                    className="w-full bg-web3-bg border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-web3-red focus:outline-none"
                    placeholder="e.g., Web Development Certification"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Description</label>
                  <textarea
                    name="description"
                    value={metadata.description}
                    onChange={handleMetadataChange}
                    className="w-full bg-web3-bg border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-web3-red focus:outline-none h-24"
                    placeholder="Describe your certificate..."
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Issuer</label>
                  <input
                    type="text"
                    name="issuer"
                    value={metadata.issuer}
                    onChange={handleMetadataChange}
                    className="w-full bg-web3-bg border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-web3-red focus:outline-none"
                    placeholder="e.g., Tech Academy"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Issuance Date</label>
                    <input
                      type="date"
                      name="issuanceDate"
                      value={metadata.issuanceDate}
                      onChange={handleMetadataChange}
                      className="w-full bg-web3-bg border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-web3-red focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Expiry Date (Optional)</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={metadata.expiryDate}
                      onChange={handleMetadataChange}
                      className="w-full bg-web3-bg border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-web3-red focus:outline-none"
                    />
                  </div>
                </div>

                {/* Delivery Method Selection */}
                <div className="mt-6">
                  <label className="block text-gray-400 text-sm mb-2">Delivery Method</label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={() => setDeliveryMethod('wallet')}
                      className={`flex-1 ${
                        deliveryMethod === 'wallet'
                          ? 'bg-web3-red text-white'
                          : 'bg-web3-bg text-gray-400 hover:bg-web3-red/10'
                      }`}
                    >
                      Wallet
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setDeliveryMethod('email')}
                      className={`flex-1 ${
                        deliveryMethod === 'email'
                          ? 'bg-web3-red text-white'
                          : 'bg-web3-bg text-gray-400 hover:bg-web3-red/10'
                      }`}
                    >
                      Email
                    </Button>
                  </div>
                </div>

                {/* Recipient Input */}
                {deliveryMethod === 'wallet' ? (
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Wallet Address</label>
                    <input
                      type="text"
                      value={walletAddress || ''}
                      disabled
                      className="w-full bg-web3-bg border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-web3-red focus:outline-none"
                      placeholder="Connect wallet to continue..."
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-web3-bg border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-web3-red focus:outline-none"
                      placeholder="Enter recipient's email"
                    />
                  </div>
                )}

                <Button
                  onClick={handleMint}
                  disabled={!isFormValid() || minting}
                  className="w-full bg-web3-red hover:bg-web3-red/90 text-white py-3 rounded-lg mt-6 relative"
                >
                  {minting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {getStatusMessage()}
                    </span>
                  ) : (
                    "Mint NFT"
                  )}
                </Button>

                {mintingStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2 text-green-500 mt-4"
                  >
                    <Check className="w-5 h-5" />
                    <span>Successfully minted!</span>
                  </motion.div>
                )}

                {mintingStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2 text-red-500 mt-4"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span>{error || 'Error minting NFT. Please try again.'}</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};