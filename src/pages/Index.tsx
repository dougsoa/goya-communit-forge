import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import LanguageSelector from "@/components/LanguageSelector";
import PostList from "@/components/PostList";
import MinimalPostList from "@/components/MinimalPostList";
import EnhancedPostList from "@/components/EnhancedPostList";
import CreatePost from "@/components/CreatePost";
import FooterBar from "@/components/FooterBar";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Globe, User as UserIcon, LogOut } from "lucide-react";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    setUserProfile(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mobile optimized */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Globe className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold sm:text-xl">{t('goya_communit')}</h1>
          </div>

          <div className="flex items-center space-x-2">
            <LanguageSelector />
            {user ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/profile")}
                  className="hidden sm:flex items-center space-x-2"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Profile</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/profile")}
                  className="sm:hidden p-2"
                >
                  <UserIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSignOut}
                  className="hidden sm:flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('sign_out')}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSignOut}
                  className="sm:hidden p-2"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="community" size="sm" onClick={() => navigate("/auth")}>
                <UserIcon className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="text-sm">{t('join')}</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Mobile optimized */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">{t('global_community')}</h2>
          <p className="text-muted-foreground">{t('share_ideas')}</p>
        </div>

        {user && (
          <CreatePost 
            userProfile={userProfile}
            onPostCreated={() => setRefreshKey(prev => prev + 1)}
          />
        )}

        <EnhancedPostList key={refreshKey} user={user} />
      
      <FooterBar />
      </main>
    </div>
  );
};

export default Index;
