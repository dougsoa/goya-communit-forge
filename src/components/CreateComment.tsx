import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeInput, validateComment } from "@/lib/security";

interface CreateCommentProps {
  postId: string;
  parentCommentId?: string;
  onCommentCreated: () => void;
  placeholder?: string;
}

const CreateComment = ({ postId, parentCommentId, onCommentCreated, placeholder }: CreateCommentProps) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation and sanitization
    const sanitizedContent = sanitizeInput(content);
    
    const contentValidation = validateComment(sanitizedContent);
    if (!contentValidation.isValid) {
      toast({
        title: "Invalid comment",
        description: contentValidation.error,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Autenticação necessária",
          description: "Por favor, faça login para comentar",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('comments')
        .insert({
          content: sanitizedContent,
          post_id: postId,
          user_id: user.id,
          parent_comment_id: parentCommentId || null,
        });

      if (error) throw error;

      setContent("");
      onCommentCreated();
      
      toast({
        title: "Sucesso",
        description: "Comentário postado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder={placeholder || t('add_comment')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[80px] resize-none"
        />
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!content.trim() || loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? "Postando..." : t('post_comment')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateComment;