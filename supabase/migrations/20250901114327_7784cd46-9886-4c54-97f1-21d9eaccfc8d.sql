-- Fix kv_store security issue by adding RLS policies
-- Enable RLS on the kv_store table to prevent unauthorized access

-- Enable Row Level Security on the kv_store table
ALTER TABLE public.kv_store_173808cf ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only access their own key-value pairs
-- Assuming the keys follow a pattern like "user:{user_id}:setting" or similar
CREATE POLICY "Users can only access their own kv data" 
ON public.kv_store_173808cf 
FOR ALL 
USING (
  -- Allow access if the key starts with the user's ID
  -- This assumes keys are structured as "user:{user_id}:" or similar
  key LIKE 'user:' || auth.uid()::text || ':%' OR
  -- Or if it's a global setting that authenticated users can read
  (key LIKE 'global:%' AND auth.uid() IS NOT NULL)
)
WITH CHECK (
  -- Only allow users to insert/update their own data
  key LIKE 'user:' || auth.uid()::text || ':%'
);

-- Create separate policy for system/admin access if needed
-- This would be for configuration that only system should access
CREATE POLICY "System admin kv access" 
ON public.kv_store_173808cf 
FOR ALL 
USING (
  -- Only allow system access through security definer functions
  -- or specific admin roles (this would need to be customized based on your auth system)
  false -- Start with restrictive policy, can be modified based on actual requirements
);