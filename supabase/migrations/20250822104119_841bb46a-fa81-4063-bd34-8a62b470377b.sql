-- Security improvements: Fix function search paths and restrict profiles access (fixed)

-- Fix search_path for all security definer functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'full_name'
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_post_counters()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'comments' THEN
      -- Only increment counter for top-level comments (not replies)
      IF NEW.parent_comment_id IS NULL THEN
        UPDATE public.posts 
        SET comments_count = comments_count + 1 
        WHERE id = NEW.post_id;
      END IF;
    ELSIF TG_TABLE_NAME = 'likes' THEN
      UPDATE public.posts 
      SET likes_count = likes_count + 1 
      WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'comments' THEN
      -- Only decrement counter for top-level comments (not replies)
      IF OLD.parent_comment_id IS NULL THEN
        UPDATE public.posts 
        SET comments_count = comments_count - 1 
        WHERE id = OLD.post_id;
      END IF;
    ELSIF TG_TABLE_NAME = 'likes' THEN
      UPDATE public.posts 
      SET likes_count = likes_count - 1 
      WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Update the existing policy instead of dropping/creating
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Profiles are viewable by authenticated users only" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Add additional security policies for better data protection
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create secure function to get user profile safely
CREATE OR REPLACE FUNCTION public.get_user_profile(profile_user_id uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.username,
    p.display_name,
    p.avatar_url,
    p.bio,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.user_id = profile_user_id;
END;
$function$;

-- Add input validation function for posts
CREATE OR REPLACE FUNCTION public.validate_post_content(title text, content text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Validate title length (1-200 characters)
  IF title IS NULL OR length(trim(title)) < 1 OR length(title) > 200 THEN
    RETURN FALSE;
  END IF;
  
  -- Validate content length (1-10000 characters)  
  IF content IS NULL OR length(trim(content)) < 1 OR length(content) > 10000 THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$function$;

-- Add content validation trigger for posts
CREATE OR REPLACE FUNCTION public.validate_post_before_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NOT public.validate_post_content(NEW.title, NEW.content) THEN
    RAISE EXCEPTION 'Invalid post content: Title must be 1-200 characters and content 1-10000 characters';
  END IF;
  RETURN NEW;
END;
$function$;

-- Create the validation trigger
DROP TRIGGER IF EXISTS validate_post_content_trigger ON public.posts;
CREATE TRIGGER validate_post_content_trigger
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_post_before_insert();

-- Add rate limiting table for posts
CREATE TABLE IF NOT EXISTS public.user_post_rate_limit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  posts_count integer NOT NULL DEFAULT 0,
  last_reset timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on rate limit table
ALTER TABLE public.user_post_rate_limit ENABLE ROW LEVEL SECURITY;

-- Add policies for rate limit table
CREATE POLICY "Users can view their own rate limit" 
ON public.user_post_rate_limit 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rate limit" 
ON public.user_post_rate_limit 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rate limit" 
ON public.user_post_rate_limit 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Add function to check rate limit (max 10 posts per hour)
CREATE OR REPLACE FUNCTION public.check_post_rate_limit(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  current_count integer;
  last_reset_time timestamp with time zone;
BEGIN
  -- Get or create rate limit record
  SELECT posts_count, last_reset 
  INTO current_count, last_reset_time
  FROM public.user_post_rate_limit 
  WHERE user_id = user_uuid;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.user_post_rate_limit (user_id, posts_count, last_reset)
    VALUES (user_uuid, 0, now());
    RETURN TRUE;
  END IF;
  
  -- Reset counter if more than 1 hour has passed
  IF last_reset_time < now() - interval '1 hour' THEN
    UPDATE public.user_post_rate_limit 
    SET posts_count = 0, last_reset = now()
    WHERE user_id = user_uuid;
    current_count = 0;
  END IF;
  
  -- Check if under limit (10 posts per hour)
  IF current_count >= 10 THEN
    RETURN FALSE;
  END IF;
  
  -- Increment counter
  UPDATE public.user_post_rate_limit 
  SET posts_count = posts_count + 1
  WHERE user_id = user_uuid;
  
  RETURN TRUE;
END;
$function$;

-- Add rate limiting trigger for posts
CREATE OR REPLACE FUNCTION public.enforce_post_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NOT public.check_post_rate_limit(NEW.user_id) THEN
    RAISE EXCEPTION 'Rate limit exceeded: Maximum 10 posts per hour allowed';
  END IF;
  RETURN NEW;
END;
$function$;

-- Create the rate limiting trigger
DROP TRIGGER IF EXISTS enforce_post_rate_limit_trigger ON public.posts;
CREATE TRIGGER enforce_post_rate_limit_trigger
  BEFORE INSERT ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_post_rate_limit();

-- Add audit log table for security monitoring
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs (only admins can view)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create audit logging function
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values)
    VALUES (OLD.user_id, TG_OP, TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (NEW.user_id, TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
    VALUES (NEW.user_id, TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$function$;

-- Add audit triggers to critical tables
CREATE TRIGGER audit_posts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_profiles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_audit_event();