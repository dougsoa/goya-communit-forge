import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CommentItem from "./CommentItem";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  post_id: string;
  parent_comment_id?: string;
  profiles: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

interface CommentsListProps {
  postId: string;
  currentUserId?: string;
  onCommentUpdated: () => void;
}

const CommentsList = ({ postId, currentUserId, onCommentUpdated }: CommentsListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      // First get all comments for this post
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      if (!commentsData || commentsData.length === 0) {
        setComments([]);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(commentsData.map(comment => comment.user_id))];
      
      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, username, display_name, avatar_url')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of profiles by user_id
      const profilesMap = new Map(
        profilesData?.map(profile => [profile.user_id, profile]) || []
      );

      // Combine comments with profiles
      const commentsWithProfiles = commentsData.map(comment => ({
        ...comment,
        profiles: profilesMap.get(comment.user_id) || {
          username: 'Unknown',
          display_name: 'Unknown User',
          avatar_url: null
        }
      }));

      // Organize comments into threads (top-level comments and their replies)
      const topLevelComments = commentsWithProfiles.filter(comment => !comment.parent_comment_id);
      const repliesMap = new Map<string, any[]>();
      
      // Group replies by their parent comment ID
      commentsWithProfiles.forEach(comment => {
        if (comment.parent_comment_id) {
          if (!repliesMap.has(comment.parent_comment_id)) {
            repliesMap.set(comment.parent_comment_id, []);
          }
          repliesMap.get(comment.parent_comment_id)?.push(comment);
        }
      });

      // Add replies to their parent comments
      const commentsWithReplies = topLevelComments.map(comment => ({
        ...comment,
        replies: repliesMap.get(comment.id) || []
      }));

      setComments(commentsWithReplies);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao carregar comentários",
        variant: "destructive",
      });
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentUpdated = () => {
    onCommentUpdated();
    fetchComments();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-card p-4 rounded-lg animate-pulse">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-8 w-8 bg-muted rounded-full"></div>
              <div className="h-4 bg-muted rounded w-24"></div>
            </div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        Comentários ({comments.length})
      </h3>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          replies={(comment as any).replies || []}
          onCommentUpdated={handleCommentUpdated}
        />
      ))}
    </div>
  );
};

export default CommentsList;