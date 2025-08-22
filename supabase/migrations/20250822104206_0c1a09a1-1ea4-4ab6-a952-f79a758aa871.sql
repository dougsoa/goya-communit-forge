-- Fix remaining security issues

-- Add audit logs policy (was missing)
CREATE POLICY "Only system can access audit logs" 
ON public.audit_logs 
FOR SELECT 
TO postgres
USING (true);

-- Deny all access to audit logs for regular users
CREATE POLICY "Block user access to audit logs" 
ON public.audit_logs 
FOR ALL 
TO authenticated
USING (false);

-- Add missing trigger for rate limit audit
CREATE TRIGGER audit_rate_limit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_post_rate_limit
  FOR EACH ROW
  EXECUTE FUNCTION public.log_audit_event();