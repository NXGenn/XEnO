import { CertificateMetadata, MintingDetails } from '../types/nft';

export async function uploadToPinata(file: File, metadata: CertificateMetadata) {
  try {
    // Create form data for the file
    const formData = new FormData();
    formData.append('file', file);

    // Upload file to Pinata
    const fileRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
      body: formData,
    });

    if (!fileRes.ok) {
      const errorData = await fileRes.text();
      throw new Error(`Failed to upload file to Pinata: ${fileRes.status} ${fileRes.statusText}. ${errorData}`);
    }

    const fileData = await fileRes.json();
    const imageUrl = `ipfs://${fileData.IpfsHash}`;

    // Create metadata JSON
    const nftMetadata = {
      name: metadata.name,
      description: metadata.description,
      image: imageUrl,
      attributes: [
        {
          trait_type: "Issuer",
          value: metadata.issuer
        },
        {
          trait_type: "Issuance Date",
          value: metadata.issuanceDate
        },
        {
          trait_type: "Expiry Date",
          value: metadata.expiryDate || "Never"
        }
      ]
    };

    // Upload metadata to Pinata
    const metadataRes = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
      body: JSON.stringify(nftMetadata),
    });

    if (!metadataRes.ok) {
      const errorData = await metadataRes.text();
      throw new Error(`Failed to upload metadata to Pinata: ${metadataRes.status} ${metadataRes.statusText}. ${errorData}`);
    }

    const metadataData = await metadataRes.json();
    return {
      metadataUrl: `ipfs://${metadataData.IpfsHash}`,
      name: metadata.name,
      image: imageUrl
    };
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to Pinata. Please check your internet connection and try again.');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred while uploading to Pinata');
  }
}

export async function mintWithCrossmint(
  metadataUrl: string, 
  name: string, 
  image: string, 
  recipient: string,
  isEmail: boolean = false
) {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/mint-nft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        metadataUrl,
        name,
        image,
        recipientAddress: String(recipient),
        isEmail
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to mint NFT');
    }

    const data = await response.json();
    console.log('Full minting response:', data);

    return {
      mintingId: data.id,
      status: data.status || 'pending',
      onChain: {
        contractAddress: data.contractAddress || data.onChain?.contractAddress,
        tokenId: data.tokenId || data.onChain?.tokenId,
      },
      transactionHash: data.transactionHash
    };
  } catch (error) {
    console.error('Error minting with Crossmint:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while minting with Crossmint');
  }
}

export async function checkMintingStatus(mintingId: string) {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/check-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ mintingId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to check minting status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking minting status:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while checking minting status');
  }
}