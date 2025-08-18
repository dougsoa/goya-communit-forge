import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { X } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

interface EditPostProps {
  post: {
    id: string;
    title: string;
    content: string;
    user_id: string;
  };
  userProfile?: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  onPostUpdated: () => void;
  onCancel: () => void;
}

const EditPost = ({ post, userProfile, onPostUpdated, onCancel }: EditPostProps) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: title.trim(),
          content: content.trim(),
        })
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: "Post updated",
        description: "Your post has been updated successfully!",
      });

      onPostUpdated();
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
    <Card className="p-6 bg-gradient-card shadow-medium border-primary/5 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userProfile?.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userProfile?.display_name?.charAt(0) || userProfile?.username?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h4 className="font-semibold text-foreground">
              {userProfile?.display_name || userProfile?.username || "Anonymous"}
            </h4>
            <p className="text-sm text-muted-foreground">
              Editing post
            </p>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={onCancel}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder={t('title_placeholder')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-medium border-none bg-transparent p-0 focus-visible:ring-0"
          required
        />

        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder={t('content_placeholder')}
          className="min-h-32 border-none bg-transparent p-0 resize-none focus-visible:ring-0"
        />

        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            {t('cancel')}
          </Button>
          
          <Button
            type="submit"
            variant="hero"
            disabled={loading || !title.trim() || !content.trim()}
          >
            {loading ? "..." : "Update"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EditPost;