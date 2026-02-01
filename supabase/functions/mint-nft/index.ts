import { corsHeaders } from "../_shared/cors.ts";

interface MintRequest {
  metadataUrl: string;
  name: string;
  image: string;
  recipientAddress: string;
  isEmail: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { metadataUrl, name, image, recipientAddress, isEmail } = await req.json() as MintRequest;

    if (!metadataUrl || !recipientAddress) {
      throw new Error('Missing required parameters');
    }

    // Validate recipient format based on type
    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recipientAddress)) {
        throw new Error('Invalid email address');
      }
    } else {
      // Validate Ethereum wallet address
      const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
      if (!ethereumAddressRegex.test(recipientAddress)) {
        throw new Error('Invalid Ethereum wallet address');
      }
    }

    const apiKey = Deno.env.get('CROSSMINT_API_KEY');
    const clientSecret = Deno.env.get('CROSSMINT_CLIENT_SECRET');
    const projectId = Deno.env.get('CROSSMINT_PROJECT_ID');
    const COLLECTION_ID = Deno.env.get('CROSSMINT_COLLECTION_ID')!;
    console.log("Minting with collection ID:", COLLECTION_ID);

    if (!apiKey || !projectId) {
      throw new Error('Missing Crossmint credentials');
    }

    // Construct request body based on recipient type
    const requestBody = {
      recipient: isEmail 
        ? { email: recipientAddress } // Use object format for email
        : `polygon:${recipientAddress}`, // Use string format with polygon: prefix
      metadata: {
        name: name,
        image: image,
        uri: metadataUrl
      }
    };

    console.log("Request body:", JSON.stringify(requestBody));

    const response = await fetch(`https://crossmint.com/api/2022-06-09/collections/${COLLECTION_ID}/nfts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-secret': clientSecret || '',
        'x-project-id': projectId,
        'X-API-KEY': apiKey
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Crossmint API error:', data);
      throw new Error(`Crossmint API error: ${JSON.stringify(data)}`);
    }

    console.log('Crossmint API successful response:', data);
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});