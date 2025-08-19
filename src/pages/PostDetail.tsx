import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart, MessageCircle, Share2, Twitter, Linkedin, Facebook, Link } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS, es, fr, de, it, ja, ko, zhCN, ar, ru, hi } from "date-fns/locale";
import MDEditor from '@uiw/react-md-editor';
import CommentsList from "@/components/CommentsList";
import CreateComment from "@/components/CreateComment";

const locales = {
  pt: ptBR,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
  ja: ja,
  ko: ko,
  zh: zhCN,
  ar: ar,
  ru: ru,
  hi: hi,
};

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  user_id: string;
  profiles: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [commentsKey, setCommentsKey] = useState(0);

  const locale = locales[language] || locales.en;

  useEffect(() => {
    if (id) {
      fetchPost();
      checkUserLikeStatus();
    }
  }, [id]);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchPost = async () => {
    try {
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (postError) throw postError;

      if (postData) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, display_name, avatar_url')
          .eq('user_id', postData.user_id)
          .single();

        if (profileError) throw profileError;

        setPost({
          ...postData,
          profiles: profileData || {
            username: 'Unknown',
            display_name: 'Unknown User',
            avatar_url: null
          }
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load post",
        variant: "destructive",
      });
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserLikeStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = async () => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to like posts",
          variant: "destructive",
        });
        return;
      }

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id);

        if (error) throw error;

        setIsLiked(false);
        setPost(prev => prev ? { ...prev, likes_count: prev.likes_count - 1 } : null);
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({ post_id: id, user_id: user.id });

        if (error) throw error;

        setIsLiked(true);
        setPost(prev => prev ? { ...prev, likes_count: prev.likes_count + 1 } : null);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post?.title || '';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast({
          title: t('link_copied'),
          description: "Link copied to clipboard",
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const refreshComments = () => {
    setCommentsKey(prev => prev + 1);
    fetchPost(); // Refresh comment count
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <Card className="p-8">
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('back_to_feed')}
          </Button>
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Post not found</h2>
            <p className="text-muted-foreground">The post you're looking for doesn't exist or has been removed.</p>
          </Card>
        </div>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back_to_feed')}
        </Button>

        {/* Post content */}
        <Card className="p-8 mb-6">
          {/* Title */}
          <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center mb-6 text-sm text-muted-foreground">
            <span className="font-medium">
              {post.profiles.display_name || post.profiles.username}
            </span>
            <span className="mx-2">•</span>
            <span>{timeAgo}</span>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <MDEditor.Markdown 
              source={post.content} 
              style={{ backgroundColor: 'transparent' }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-2 group ${
                  isLiked ? "text-red-500" : "text-muted-foreground"
                }`}
                onClick={handleLike}
              >
                <Heart 
                  className={`h-5 w-5 group-hover:scale-110 transition-smooth ${
                    isLiked ? "fill-current" : ""
                  }`} 
                />
                <span className="font-medium">{post.likes_count}</span>
                <span>{t('like')}</span>
              </Button>

              <div className="flex items-center space-x-2 text-muted-foreground">
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">{post.comments_count}</span>
                <span>{t('comment')}</span>
              </div>
            </div>

            {/* Share buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('twitter')}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('linkedin')}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('facebook')}
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('copy')}
              >
                <Link className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Comments section */}
        <div className="space-y-6">
          {user && (
            <CreateComment 
              postId={post.id} 
              onCommentCreated={refreshComments}
            />
          )}
          
          <CommentsList 
            key={commentsKey} 
            postId={post.id} 
            currentUserId={user?.id}
            onCommentUpdated={refreshComments}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;