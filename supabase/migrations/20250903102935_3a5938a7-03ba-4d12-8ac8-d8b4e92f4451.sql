-- Aplicar as atualizações de segurança que foram criadas anteriormente

-- Atualizar políticas da tabela likes para ser mais restritiva
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.likes;

CREATE POLICY "Authenticated users can view likes" 
ON public.likes 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Atualizar políticas da tabela profiles para ser mais restritiva  
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Criar função para sanitizar input
CREATE OR REPLACE FUNCTION public.sanitize_input(input_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Remove HTML tags e caracteres perigosos
  input_text := regexp_replace(input_text, '<[^>]*>', '', 'g');
  input_text := regexp_replace(input_text, '[<>&"'']', '', 'g');
  input_text := trim(input_text);
  
  RETURN input_text;
END;
$$;

-- Criar trigger para sanitizar posts antes de inserir/atualizar
CREATE OR REPLACE FUNCTION public.sanitize_post_content()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Sanitizar e validar título
  NEW.title := public.sanitize_input(NEW.title);
  
  -- Sanitizar conteúdo (mantém markdown básico)
  NEW.content := trim(NEW.content);
  
  -- Validar comprimentos
  IF length(NEW.title) < 1 OR length(NEW.title) > 200 THEN
    RAISE EXCEPTION 'Título deve ter entre 1 e 200 caracteres';
  END IF;
  
  IF length(NEW.content) < 1 OR length(NEW.content) > 10000 THEN
    RAISE EXCEPTION 'Conteúdo deve ter entre 1 e 10000 caracteres';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Aplicar trigger aos posts
DROP TRIGGER IF EXISTS sanitize_posts_trigger ON public.posts;
CREATE TRIGGER sanitize_posts_trigger
BEFORE INSERT OR UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.sanitize_post_content();

-- Criar função para sanitizar comentários
CREATE OR REPLACE FUNCTION public.sanitize_comment_content()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Sanitizar conteúdo
  NEW.content := public.sanitize_input(NEW.content);
  
  -- Validar comprimento
  IF length(NEW.content) < 1 OR length(NEW.content) > 2000 THEN
    RAISE EXCEPTION 'Comentário deve ter entre 1 e 2000 caracteres';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Aplicar trigger aos comentários
DROP TRIGGER IF EXISTS sanitize_comments_trigger ON public.comments;
CREATE TRIGGER sanitize_comments_trigger
BEFORE INSERT OR UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.sanitize_comment_content();

-- Criar tabela de rate limit para comentários
CREATE TABLE IF NOT EXISTS public.user_comment_rate_limit (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  comments_count integer NOT NULL DEFAULT 0,
  last_reset timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de rate limit de comentários
ALTER TABLE public.user_comment_rate_limit ENABLE ROW LEVEL SECURITY;

-- Políticas para rate limit de comentários
CREATE POLICY "Users can view their own comment rate limit" 
ON public.user_comment_rate_limit 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comment rate limit" 
ON public.user_comment_rate_limit 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comment rate limit" 
ON public.user_comment_rate_limit 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Criar função de verificação de rate limit para comentários
CREATE OR REPLACE FUNCTION public.check_comment_rate_limit(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_count integer;
  last_reset_time timestamp with time zone;
BEGIN
  -- Obter ou criar registro de rate limit
  SELECT comments_count, last_reset 
  INTO current_count, last_reset_time
  FROM public.user_comment_rate_limit 
  WHERE user_id = user_uuid;
  
  -- Se não existe registro, criar um
  IF NOT FOUND THEN
    INSERT INTO public.user_comment_rate_limit (user_id, comments_count, last_reset)
    VALUES (user_uuid, 0, now());
    RETURN TRUE;
  END IF;
  
  -- Resetar contador se passou mais de 1 hora
  IF last_reset_time < now() - interval '1 hour' THEN
    UPDATE public.user_comment_rate_limit 
    SET comments_count = 0, last_reset = now()
    WHERE user_id = user_uuid;
    current_count = 0;
  END IF;
  
  -- Verificar se está abaixo do limite (30 comentários por hora)
  IF current_count >= 30 THEN
    RETURN FALSE;
  END IF;
  
  -- Incrementar contador
  UPDATE public.user_comment_rate_limit 
  SET comments_count = comments_count + 1
  WHERE user_id = user_uuid;
  
  RETURN TRUE;
END;
$$;

-- Criar função de trigger para enforçar rate limit de comentários
CREATE OR REPLACE FUNCTION public.enforce_comment_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NOT public.check_comment_rate_limit(NEW.user_id) THEN
    RAISE EXCEPTION 'Limite de comentários excedido: Máximo 30 comentários por hora permitidos';
  END IF;
  RETURN NEW;
END;
$$;

-- Aplicar trigger de rate limit aos comentários
DROP TRIGGER IF EXISTS enforce_comment_rate_limit_trigger ON public.comments;
CREATE TRIGGER enforce_comment_rate_limit_trigger
BEFORE INSERT ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.enforce_comment_rate_limit();