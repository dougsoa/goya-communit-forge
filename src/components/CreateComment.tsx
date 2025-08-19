import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateCommentProps {
  postId: string;
  onCommentCreated: () => void;
}

const CreateComment = ({ postId, onCommentCreated }: CreateCommentProps) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to comment",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: content.trim()
        });

      if (error) throw error;

      setContent("");
      onCommentCreated();
      
      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
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
          placeholder={t('add_comment')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!content.trim() || loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? "Posting..." : t('post_comment')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateComment;