import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MinimalPostCard from "./MinimalPostCard";
import { useLanguage } from "@/hooks/useLanguage";

interface Post {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    display_name: string;
  };
}

const MinimalPostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Fetch posts with minimal data
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id, title, created_at, user_id')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Fetch profiles for these posts
      const userIds = [...new Set(postsData?.map(post => post.user_id) || [])];
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, username, display_name')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of profiles by user_id
      const profilesMap = new Map(
        profilesData?.map(profile => [profile.user_id, profile]) || []
      );

      // Combine posts with profiles
      const postsWithProfiles = postsData?.map(post => ({
        ...post,
        profiles: profilesMap.get(post.user_id) || {
          username: 'Unknown',
          display_name: 'Unknown User'
        }
      })) || [];

      setPosts(postsWithProfiles);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-card p-6 rounded-lg animate-pulse">
            <div className="space-y-3">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No posts yet. Be the first to share something inspiring!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <MinimalPostCard
          key={post.id}
          post={post}
        />
      ))}
    </div>
  );
};

export default MinimalPostList;