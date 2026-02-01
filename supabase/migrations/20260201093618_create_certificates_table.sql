/*
  # Create Certificates Table

  1. New Tables
    - `certificates`
      - `id` (uuid, primary key) - Unique identifier for each certificate
      - `name` (text) - Certificate name/title
      - `description` (text) - Certificate description
      - `issuer` (text) - Organization or person issuing the certificate
      - `issuance_date` (date) - Date the certificate was issued
      - `expiry_date` (date, optional) - Date when certificate expires
      - `image_url` (text) - IPFS URL of the certificate image
      - `metadata_url` (text) - IPFS URL of the complete metadata JSON
      - `owner_wallet` (text, optional) - Ethereum wallet address of the certificate owner
      - `owner_email` (text, optional) - Email address if minted via email
      - `minting_id` (text, optional) - Crossmint minting ID for tracking
      - `contract_address` (text, optional) - Smart contract address on blockchain
      - `token_id` (text, optional) - NFT token ID on the blockchain
      - `transaction_hash` (text, optional) - Blockchain transaction hash
      - `status` (text) - Minting status (pending, minting, completed, failed)
      - `created_by` (uuid, optional) - User who created the certificate
      - `created_at` (timestamptz) - Timestamp when record was created
      - `updated_at` (timestamptz) - Timestamp when record was last updated

  2. Security
    - Enable RLS on `certificates` table
    - Add policy for public read access (for verification)
    - Add policy for authenticated users to create certificates
    - Add policy for users to read their own certificates
    - Add policy for users to update their own certificates
*/

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  issuer text NOT NULL,
  issuance_date date NOT NULL,
  expiry_date date,
  image_url text NOT NULL,
  metadata_url text NOT NULL,
  owner_wallet text,
  owner_email text,
  minting_id text,
  contract_address text,
  token_id text,
  transaction_hash text,
  status text NOT NULL DEFAULT 'pending',
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'uploading', 'minting', 'completed', 'failed'))
);

-- Enable Row Level Security
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read certificates (for public verification)
CREATE POLICY "Public certificates are viewable by everyone"
  ON certificates
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert certificates
CREATE POLICY "Authenticated users can create certificates"
  ON certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

-- Policy: Users can update their own certificates
CREATE POLICY "Users can update own certificates"
  ON certificates
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by OR created_by IS NULL)
  WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_certificates_minting_id ON certificates(minting_id);
CREATE INDEX IF NOT EXISTS idx_certificates_token_id ON certificates(token_id);
CREATE INDEX IF NOT EXISTS idx_certificates_owner_wallet ON certificates(owner_wallet);
CREATE INDEX IF NOT EXISTS idx_certificates_owner_email ON certificates(owner_email);
CREATE INDEX IF NOT EXISTS idx_certificates_created_by ON certificates(created_by);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON certificates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
