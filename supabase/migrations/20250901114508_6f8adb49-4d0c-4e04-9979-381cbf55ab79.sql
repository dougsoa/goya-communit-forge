-- List all policies on kv_store table and recreate with proper security
-- First drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can access their own transaction data" ON public.kv_store_173808cf;

-- Enable RLS (ensure it's enabled)
ALTER TABLE public.kv_store_173808cf ENABLE ROW LEVEL SECURITY;

-- Create a secure policy that ensures users can only access their own financial transaction data
-- Based on the key pattern "transactions_{user_id}" that we observed in the data
CREATE POLICY "Secure user transaction access" 
ON public.kv_store_173808cf 
FOR ALL 
TO authenticated
USING (
  -- Only allow access if the key contains the user's ID
  -- Extract UUID from key pattern and match with authenticated user
  auth.uid() IS NOT NULL AND
  key ~ '^transactions_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' AND
  SUBSTRING(key FROM 'transactions_(.*)') = auth.uid()::text
)
WITH CHECK (
  -- Same check for INSERT/UPDATE operations
  auth.uid() IS NOT NULL AND
  key ~ '^transactions_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' AND
  SUBSTRING(key FROM 'transactions_(.*)') = auth.uid()::text
);