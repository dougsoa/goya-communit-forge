import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { Plus, X } from "lucide-react";

interface CreatePostProps {
  userProfile?: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  onPostCreated: () => void;
}

const CreatePost = ({ userProfile, onPostCreated }: CreatePostProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create posts",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('posts')
        .insert({
          title: title.trim(),
          content: content.trim(),
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: t('publish'),
        description: "Your post has been published successfully!",
      });

      setTitle("");
      setContent("");
      setIsExpanded(false);
      onPostCreated();
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

  if (!isExpanded) {
    return (
      <Card className="p-4 bg-gradient-card shadow-soft border-primary/5 mb-6">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userProfile?.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userProfile?.display_name?.charAt(0) || userProfile?.username?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          
          <button
            onClick={() => setIsExpanded(true)}
            className="flex-1 text-left p-3 rounded-full bg-muted hover:bg-muted/80 transition-smooth text-muted-foreground"
          >
            {t('post_something')}
          </button>

          <Button 
            variant="community" 
            size="icon"
            onClick={() => setIsExpanded(true)}
            aria-label={t('create_post')}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

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
              {t('share_ideas')}
            </p>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => {
            setIsExpanded(false);
            setTitle("");
            setContent("");
          }}
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

        <Textarea
          placeholder={t('content_placeholder')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-32 border-none bg-transparent p-0 resize-none focus-visible:ring-0"
          required
        />

        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsExpanded(false);
              setTitle("");
              setContent("");
            }}
          >
            {t('cancel')}
          </Button>
          
          <Button
            type="submit"
            variant="hero"
            disabled={loading || !title.trim() || !content.trim()}
          >
            {loading ? "..." : t('publish')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreatePost;