import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
import PostAuthor from "./PostAuthor";
import PostActions from "./PostActions";


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
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showFullContent, setShowFullContent] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    <Card className="p-6 bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 border-primary/5 hover:border-primary/10">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <PostAuthor 
          profiles={post.profiles}
          createdAt={post.created_at}
          size="md"
        />
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground leading-tight hover:text-primary transition-colors">
          {post.title}
        </h3>
        
        <div className="text-muted-foreground leading-relaxed prose prose-sm max-w-none">
          <MDEditor.Markdown 
            source={displayContent} 
            style={{ whiteSpace: 'pre-wrap', backgroundColor: 'transparent', color: 'inherit' }}
          />
          
          {shouldTruncate && (
            <Button
              variant="link"
              className="p-0 h-auto text-primary font-medium mt-2 hover:underline"
              onClick={() => setShowFullContent(!showFullContent)}
            >
              {showFullContent ? "Mostrar menos" : t('read_more')}
            </Button>
          )}
        </div>
      </div>

      {/* Actions */}
      <PostActions
        likesCount={post.likes_count}
        commentsCount={post.comments_count}
        isLiked={isLiked}
        isOwner={isOwner}
        onLike={() => onLike(post.id)}
        onComment={() => onComment(post.id)}
        onEdit={() => onEdit?.(post)}
        onDelete={() => setShowDeleteDialog(true)}
      />

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