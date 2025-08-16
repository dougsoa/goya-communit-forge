import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS, es, fr, de, it, ja, ko, zhCN, ar, ru, hi } from "date-fns/locale";

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

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    likes_count: number;
    comments_count: number;
    profiles: {
      username: string;
      display_name: string;
      avatar_url?: string;
    };
  };
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  isLiked?: boolean;
}

const PostCard = ({ post, onLike, onComment, isLiked = false }: PostCardProps) => {
  const { t, language } = useLanguage();
  const [showFullContent, setShowFullContent] = useState(false);

  const locale = locales[language] || locales.en;
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale,
  });

  const shouldTruncate = post.content.length > 300;
  const displayContent = shouldTruncate && !showFullContent 
    ? post.content.slice(0, 300) + "..." 
    : post.content;

  return (
    <Card className="p-6 bg-gradient-card shadow-soft hover:shadow-medium transition-smooth border-primary/5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.profiles.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {post.profiles.display_name?.charAt(0) || post.profiles.username?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h4 className="font-semibold text-foreground">
              {post.profiles.display_name || post.profiles.username}
            </h4>
            <p className="text-sm text-muted-foreground">
              @{post.profiles.username} • {timeAgo}
            </p>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground leading-tight">
          {post.title}
        </h3>
        
        <div className="text-muted-foreground leading-relaxed">
          <p>{displayContent}</p>
          
          {shouldTruncate && (
            <Button
              variant="link"
              className="p-0 h-auto text-primary font-medium mt-2"
              onClick={() => setShowFullContent(!showFullContent)}
            >
              {showFullContent ? "Show less" : t('read_more')}
            </Button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center space-x-2 group ${
              isLiked ? "text-red-500" : "text-muted-foreground"
            }`}
            onClick={() => onLike(post.id)}
          >
            <Heart 
              className={`h-4 w-4 group-hover:scale-110 transition-smooth ${
                isLiked ? "fill-current" : ""
              }`} 
            />
            <span className="text-sm font-medium">
              {post.likes_count > 0 && post.likes_count}
            </span>
            <span className="text-sm">{t('like')}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-muted-foreground group"
            onClick={() => onComment(post.id)}
          >
            <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-smooth" />
            <span className="text-sm font-medium">
              {post.comments_count > 0 && post.comments_count}
            </span>
            <span className="text-sm">{t('comment')}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-muted-foreground group"
          >
            <Share className="h-4 w-4 group-hover:scale-110 transition-smooth" />
            <span className="text-sm">{t('share')}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;