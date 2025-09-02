import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import PostAuthor from "./PostAuthor";

interface MinimalPostCardProps {
  post: {
    id: string;
    title: string;
    created_at: string;
    user_id: string;
    profiles: {
      username: string;
      display_name: string;
    };
  };
}

const MinimalPostCard = ({ post }: MinimalPostCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <Card 
      className="p-6 bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 border-primary/5 hover:border-primary/10 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Title - Main focus */}
      <h3 className="text-xl font-bold text-foreground leading-tight mb-4 group-hover:text-primary transition-colors">
        {post.title}
      </h3>
      
      {/* Author and Date */}
      <PostAuthor 
        profiles={post.profiles}
        createdAt={post.created_at}
        size="sm"
        showAvatar={false}
      />
    </Card>
  );
};

export default MinimalPostCard;