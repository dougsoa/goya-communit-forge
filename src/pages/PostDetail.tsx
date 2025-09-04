import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart, MessageCircle, Edit, Trash2, MoreVertical } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import MDEditor from '@uiw/react-md-editor';
import CommentsList from "@/components/CommentsList";
import CreateComment from "@/components/CreateComment";
import EditPost from "@/components/EditPost";
import PostAuthor from "@/components/PostAuthor";
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
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post?.id);

      if (error) throw error;

      toast({
        title: "Post deletado",
        description: "Seu post foi excluído com sucesso.",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handlePostUpdated = () => {
    setIsEditing(false);
    fetchPost();
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
        {isEditing ? (
          <EditPost
            post={post}
            userProfile={post.profiles}
            onPostUpdated={handlePostUpdated}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <Card className="p-8 mb-6 bg-gradient-card shadow-medium">
            {/* Header with edit options */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-foreground mb-6 leading-tight">
                  {post.title}
                </h1>
                
                {/* Author info */}
                <PostAuthor 
                  profiles={post.profiles}
                  createdAt={post.created_at}
                  size="lg"
                />
              </div>

              {/* Edit/Delete options for post owner */}
              {user && user.id === post.user_id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
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
              )}
            </div>

            {/* Content */}
            <div className="prose prose-xl max-w-none mb-8 text-foreground [&_*]:text-foreground">
              <MDEditor.Markdown 
                source={post.content} 
                style={{ backgroundColor: 'transparent', color: 'hsl(var(--foreground))' }}
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
                  } ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={user ? handleLike : () => {
                    toast({
                      title: t('login_to_like'),
                      description: "Faça login para curtir posts",
                      variant: "destructive",
                    });
                  }}
                  disabled={false}
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
            </div>
          </Card>
        )}

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

        {/* Comments section */}
        <div className="space-y-6">
          {user ? (
            <CreateComment 
              postId={post.id} 
              onCommentCreated={refreshComments}
            />
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                {t('login_to_comment')}
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline"
              >
                {t('sign_in')}
              </Button>
            </Card>
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