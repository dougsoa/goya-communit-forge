-- Add parent_comment_id to comments table for nested comments
ALTER TABLE public.comments 
ADD COLUMN parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;

-- Add unique constraint to ensure one like per user per post
ALTER TABLE public.likes 
ADD CONSTRAINT unique_user_post_like UNIQUE (user_id, post_id);

-- Update the update_post_counters function to handle nested comments properly
CREATE OR REPLACE FUNCTION public.update_post_counters()
RETURNS trigger
LANGUAGE plpgsql
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