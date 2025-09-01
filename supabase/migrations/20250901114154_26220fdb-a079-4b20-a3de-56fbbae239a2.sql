-- Fix audit logs security issue by removing permissive policy
-- and ensuring only system can access audit logs

-- First, drop the existing permissive policy that allows public access
DROP POLICY IF EXISTS "Only system can access audit logs" ON public.audit_logs;

-- Create a restrictive policy that only allows system/admin access
-- This policy will only allow access when the user has a specific role or through security definer functions
CREATE POLICY "System only audit logs access" 
ON public.audit_logs 
FOR ALL 
USING (false)  -- No direct user access allowed
WITH CHECK (false);  -- No direct user insertions allowed

-- Audit logs should only be accessible through security definer functions
-- that are called by triggers and system processes, not directly by users