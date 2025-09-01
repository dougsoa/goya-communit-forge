-- Check current policies and fix kv_store security
-- First, let's see what policies currently exist and drop them if needed

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can only access their own kv data" ON public.kv_store_173808cf;
DROP POLICY IF EXISTS "System admin kv access" ON public.kv_store_173808cf;

-- Ensure RLS is enabled
ALTER TABLE public.kv_store_173808cf ENABLE ROW LEVEL SECURITY;

-- Since the data contains user transactions with keys like "transactions_{user_id}"
-- Create a proper policy to ensure users can only access their own financial data
CREATE POLICY "Users can access their own transaction data" 
ON public.kv_store_173808cf 
FOR ALL 
USING (
  -- Extract user ID from the key pattern "transactions_{user_id}"
  -- and ensure it matches the authenticated user
  CASE 
    WHEN key LIKE 'transactions_%' THEN 
      -- Extract the UUID part after "transactions_" and compare with auth.uid()
      (SUBSTRING(key FROM 'transactions_(.*)'))::uuid = auth.uid()
    ELSE 
      -- For other key patterns, require authentication but may need customization
      auth.uid() IS NOT NULL
  END
)
WITH CHECK (
  -- Same logic for INSERT/UPDATE operations
  CASE 
    WHEN key LIKE 'transactions_%' THEN 
      (SUBSTRING(key FROM 'transactions_(.*)'))::uuid = auth.uid()
    ELSE 
      auth.uid() IS NOT NULL
  END
);