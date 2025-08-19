import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS, es, fr, de, it, ja, ko, zhCN, ar, ru, hi } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
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

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: {
      username: string;
      display_name: string;
      avatar_url?: string;
    };
  };
  currentUserId?: string;
  onCommentDeleted: () => void;
}

const CommentItem = ({ comment, currentUserId, onCommentDeleted }: CommentItemProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const locale = locales[language] || locales.en;
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale,
  });

  const isOwner = currentUserId === comment.user_id;

  const handleEdit = async () => {
    if (!editContent.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .update({ content: editContent.trim() })
        .eq('id', comment.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Comment updated successfully",
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

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', comment.id);

      if (error) throw error;

      onCommentDeleted();
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.profiles.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {comment.profiles.display_name?.charAt(0) || comment.profiles.username?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h5 className="font-medium text-foreground text-sm">
              {comment.profiles.display_name || comment.profiles.username}
            </h5>
            <p className="text-xs text-muted-foreground">
              {timeAgo}
            </p>
          </div>
        </div>

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="h-3 w-3 mr-2" />
                {t('edit_comment')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                {t('delete_comment')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex justify-end space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
              }}
            >
              {t('cancel')}
            </Button>
            <Button 
              size="sm"
              onClick={handleEdit}
              disabled={!editContent.trim() || loading}
            >
              {loading ? "Saving..." : t('save')}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-foreground leading-relaxed">
          {comment.content}
        </p>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default CommentItem;