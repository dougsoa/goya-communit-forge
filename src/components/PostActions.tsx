import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Edit, Trash2, MoreVertical } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostActionsProps {
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isOwner?: boolean;
  isAuthenticated?: boolean;
  onLike: () => void;
  onComment: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

const PostActions = ({
  likesCount,
  commentsCount,
  isLiked = false,
  isOwner = false,
  isAuthenticated = false,
  onLike,
  onComment,
  onEdit,
  onDelete,
  disabled = false
}: PostActionsProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between pt-4 border-t border-border">
      <div className="flex items-center space-x-6">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center space-x-2 group transition-all ${
            isLiked ? "text-red-500" : "text-muted-foreground"
          } ${disabled || !isAuthenticated ? "opacity-50 cursor-not-allowed" : "hover:text-red-500"}`}
          onClick={isAuthenticated ? onLike : undefined}
          disabled={disabled || !isAuthenticated}
        >
          <Heart 
            className={`h-4 w-4 group-hover:scale-110 transition-transform ${
              isLiked ? "fill-current" : ""
            }`} 
          />
          <span className="text-sm font-medium">
            {likesCount > 0 ? likesCount : ""}
          </span>
          <span className="text-sm">{isLiked ? "Curtido" : t('like')}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center space-x-2 text-muted-foreground group transition-colors ${
            isAuthenticated ? "hover:text-primary" : "opacity-50 cursor-not-allowed"
          }`}
          onClick={isAuthenticated ? onComment : undefined}
          disabled={!isAuthenticated}
        >
          <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">
            {commentsCount > 0 ? commentsCount : ""}
          </span>
          <span className="text-sm">{t('comment')}</span>
        </Button>
      </div>

      {isOwner && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-70 hover:opacity-100">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onDelete}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default PostActions;