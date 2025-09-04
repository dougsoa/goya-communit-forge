-- Update profiles RLS policy to allow public viewing of basic profile info
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create new policy allowing everyone to view basic profile information
CREATE POLICY "Public can view basic profile info" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Keep existing policies for insert, update, delete as they should remain restricted to authenticated users