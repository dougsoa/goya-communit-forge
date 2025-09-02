import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import MinimalPostCard from "./MinimalPostCard";
import SearchAndFilters from "./SearchAndFilters";
import PostGrid from "./PostGrid";
import { useLanguage } from "@/hooks/useLanguage";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  tags: string[] | null;
  profiles: {
    username: string;
    display_name: string;
  };
}

interface EnhancedPostListProps {
  user?: User | null;
}

const EnhancedPostList = ({ user }: EnhancedPostListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [authorFilter, setAuthorFilter] = useState<'all' | 'own' | 'others'>('all');
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchPosts();

    // Real-time subscription
    const postsChannel = supabase
      .channel('enhanced-posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      // Fetch posts with content for search
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id, title, content, created_at, user_id, tags')
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

  // Get all available tags
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter posts based on search and filters
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Search filter
      if (searchValue) {
        const searchLower = searchValue.toLowerCase();
        const titleMatch = post.title.toLowerCase().includes(searchLower);
        const contentMatch = post.content.toLowerCase().includes(searchLower);
        const authorMatch = post.profiles.display_name?.toLowerCase().includes(searchLower) ||
                           post.profiles.username?.toLowerCase().includes(searchLower);
        
        if (!titleMatch && !contentMatch && !authorMatch) {
          return false;
        }
      }

      // Tag filter
      if (selectedTags.length > 0) {
        if (!post.tags || !selectedTags.some(tag => post.tags?.includes(tag))) {
          return false;
        }
      }

      // Author filter
      if (authorFilter === 'own' && user) {
        return post.user_id === user.id;
      } else if (authorFilter === 'others' && user) {
        return post.user_id !== user.id;
      }

      return true;
    });
  }, [posts, searchValue, selectedTags, authorFilter, user]);

  const handleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <PostGrid className="animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card p-6 rounded-lg">
            <div className="space-y-3">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </PostGrid>
    );
  }

  return (
    <div>
      <SearchAndFilters
        onSearchChange={setSearchValue}
        onTagFilter={handleTagFilter}
        onAuthorFilter={setAuthorFilter}
        selectedTags={selectedTags}
        authorFilter={authorFilter}
        searchValue={searchValue}
        availableTags={availableTags}
        isAuthenticated={!!user}
      />

      {filteredPosts.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {searchValue || selectedTags.length > 0 || authorFilter !== 'all'
              ? t('no_posts_found')
              : t('no_posts_yet')
            }
          </p>
        </div>
      ) : (
        <PostGrid>
          {filteredPosts.map((post) => (
            <MinimalPostCard
              key={post.id}
              post={post}
            />
          ))}
        </PostGrid>
      )}
    </div>
  );
};

export default EnhancedPostList;