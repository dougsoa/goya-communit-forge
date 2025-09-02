import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTimeFormatter } from "@/hooks/useTimeFormatter";

interface PostAuthorProps {
  profiles: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
  createdAt: string;
  size?: "sm" | "md" | "lg";
  showAvatar?: boolean;
}

const PostAuthor = ({ profiles, createdAt, size = "md", showAvatar = true }: PostAuthorProps) => {
  const { formatTimeAgo } = useTimeFormatter();
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-12 w-12"
  };
  
  const textClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className="flex items-center space-x-3">
      {showAvatar && (
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={profiles.avatar_url} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {profiles.username?.charAt(0)?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="min-w-0 flex-1">
        <h4 className={`font-semibold text-foreground truncate ${textClasses[size]}`}>
          {profiles.username}
        </h4>
        <p className="text-sm text-muted-foreground">
          {formatTimeAgo(createdAt)}
        </p>
      </div>
    </div>
  );
};

export default PostAuthor;