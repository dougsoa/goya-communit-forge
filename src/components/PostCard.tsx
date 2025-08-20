import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS, es, fr, de, it, ja, ko, zhCN, ar, ru, hi } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-markdown-preview/markdown.css';

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
    user_id: string;
    profiles: {
      username: string;
      display_name: string;
      avatar_url?: string;
    };
  };
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onEdit?: (post: any) => void;
  onDelete?: () => void;
  currentUserId?: string;
  isLiked?: boolean;
}

const PostCard = ({ post, onLike, onComment, onEdit, onDelete, currentUserId, isLiked = false }: PostCardProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [showFullContent, setShowFullContent] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const locale = locales[language] || locales.en;
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale,
  });

  const shouldTruncate = post.content.length > 300;
  const displayContent = shouldTruncate && !showFullContent 
    ? post.content.slice(0, 300) + "..." 
    : post.content;

  const isOwner = currentUserId === post.user_id;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: "Post excluído",
        description: "Seu post foi excluído com sucesso.",
      });

      onDelete?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

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

        {isOwner ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(post)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground leading-tight">
          {post.title}
        </h3>
        
        <div className="text-muted-foreground leading-relaxed">
          <MDEditor.Markdown 
            source={displayContent} 
            style={{ whiteSpace: 'pre-wrap', backgroundColor: 'transparent' }}
          />
          
          {shouldTruncate && (
            <Button
              variant="link"
              className="p-0 h-auto text-primary font-medium mt-2"
              onClick={() => setShowFullContent(!showFullContent)}
            >
              {showFullContent ? "Mostrar menos" : t('read_more')}
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

        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Post</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default PostCard;