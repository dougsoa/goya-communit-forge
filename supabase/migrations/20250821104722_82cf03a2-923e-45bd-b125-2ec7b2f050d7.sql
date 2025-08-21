-- Limpar posts de teste existentes
DELETE FROM public.comments;
DELETE FROM public.likes;
DELETE FROM public.posts;

-- Configurar real-time para sincronização entre dispositivos
ALTER TABLE public.posts REPLICA IDENTITY FULL;
ALTER TABLE public.comments REPLICA IDENTITY FULL;
ALTER TABLE public.likes REPLICA IDENTITY FULL;

-- Adicionar tabelas ao publication para real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.likes;