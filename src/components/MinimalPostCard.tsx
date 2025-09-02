import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS, es, fr, de, it, ja, ko, zhCN, ar, ru, hi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

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
  const { language } = useLanguage();
  const navigate = useNavigate();

  const locale = locales[language] || locales.en;
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale,
  });

  const handleCardClick = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <Card 
      className="p-6 bg-gradient-card shadow-soft hover:shadow-medium transition-smooth border-primary/5 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Title - Main focus */}
      <h3 className="text-xl font-bold text-foreground leading-tight mb-3 hover:text-primary transition-smooth">
        {post.title}
      </h3>
      
      {/* Author and Date - Secondary info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-medium">
          {post.profiles.username}
        </span>
        <span>
          {timeAgo}
        </span>
      </div>
    </Card>
  );
};

export default MinimalPostCard;