import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { Plus, X } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import { sanitizeInput, validateTitle, validateContent, PostRateLimit } from "@/lib/security";

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
    
    // Client-side validation and sanitization
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedContent = sanitizeInput(content);
    
    const titleValidation = validateTitle(sanitizedTitle);
    if (!titleValidation.isValid) {
      toast({
        title: "Invalid title",
        description: titleValidation.error,
        variant: "destructive",
      });
      return;
    }
    
    const contentValidation = validateContent(sanitizedContent);
    if (!contentValidation.isValid) {
      toast({
        title: "Invalid content",
        description: contentValidation.error,
        variant: "destructive",
      });
      return;
    }
    
    // Rate limiting check
    const rateLimitCheck = PostRateLimit.canPost();
    if (!rateLimitCheck.allowed) {
      const minutes = Math.ceil((rateLimitCheck.timeUntilReset || 0) / (60 * 1000));
      toast({
        title: "Rate limit exceeded",
        description: `You can create another post in ${minutes} minutes. Maximum 10 posts per hour.`,
        variant: "destructive",
      });
      return;
    }

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
          title: sanitizedTitle,
          content: sanitizedContent,
          user_id: user.id,
        });

      if (error) throw error;
      
      // Record successful post for rate limiting
      PostRateLimit.recordPost();

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
      <Card className="p-6 bg-gradient-card shadow-elegant border-primary/10 mb-8 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
              <AvatarImage src={userProfile?.avatar_url} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                {userProfile?.display_name?.charAt(0) || userProfile?.username?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
          
          <button
            onClick={() => setIsExpanded(true)}
            className="flex-1 text-left p-4 rounded-2xl bg-gradient-subtle hover:bg-gradient-card transition-all duration-300 text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/30 hover:shadow-medium"
          >
            <span className="text-lg">{t('post_something')}</span>
          </button>

          <Button 
            variant="hero" 
            size="icon"
            onClick={() => setIsExpanded(true)}
            aria-label={t('create_post')}
            className="h-12 w-12 rounded-xl shadow-medium hover:shadow-elegant transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </Card>
    );
  }

    return (
      <Card className="p-8 bg-gradient-card shadow-elegant border-primary/10 mb-8 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                <AvatarImage src={userProfile?.avatar_url} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                  {userProfile?.display_name?.charAt(0) || userProfile?.username?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background"></div>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground text-lg">
                {userProfile?.display_name || userProfile?.username || "Anonymous"}
              </h4>
              <p className="text-muted-foreground">
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
            className="h-10 w-10 rounded-xl hover:bg-muted/50 transition-all duration-300"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              placeholder={t('title_placeholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold border-none bg-gradient-subtle rounded-xl p-4 h-14 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder={t('content_placeholder')}
              className="min-h-40 border-none bg-gradient-subtle rounded-xl p-4 resize-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all text-lg"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsExpanded(false);
                setTitle("");
                setContent("");
              }}
              className="h-12 px-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-medium"
            >
              {t('cancel')}
            </Button>
            
            <Button
              type="submit"
              variant="hero"
              disabled={loading || !title.trim() || !content.trim()}
              className="h-12 px-8 text-lg font-semibold rounded-xl shadow-medium hover:shadow-elegant transition-all duration-300"
            >
              {loading ? "..." : t('publish')}
            </Button>
          </div>
        </form>
    </Card>
  );
};

export default CreatePost;