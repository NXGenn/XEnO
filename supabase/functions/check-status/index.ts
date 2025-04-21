import { corsHeaders } from "../_shared/cors.ts";

interface StatusRequest {
  mintingId: string;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { mintingId } = await req.json() as StatusRequest;

    if (!mintingId) {
      throw new Error('Missing minting ID');
    }

    const apiKey = Deno.env.get('CROSSMINT_API_KEY');
    const projectId = Deno.env.get('CROSSMINT_PROJECT_ID');

    if (!apiKey || !projectId) {
      throw new Error('Missing Crossmint credentials');
    }

    const response = await fetch(`https://crossmint.com/api/2022-06-09/nfts/${mintingId}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey,
        'x-project-id': projectId,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Crossmint API error:', data);
      throw new Error(`Crossmint API error: ${JSON.stringify(data)}`);
    }

    // Extract relevant information
    const result = {
      status: data.status,
      onChain: {
        contractAddress: data.onChain?.contractAddress,
        tokenId: data.onChain?.tokenId,
      },
      transactionHash: data.transactionHash,
    };

    return new Response(JSON.stringify(result), {
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