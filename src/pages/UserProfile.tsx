import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { User, Mail, Trash2, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      setUser(user);

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (profileData) {
        setProfile(profileData);
        setUsername(profileData.username || "");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: username.trim() })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Username updated successfully!",
      });

      fetchUserData();
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

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);

    try {
      // First delete user's data from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Delete posts by the user
      const { error: postsError } = await supabase
        .from('posts')
        .delete()
        .eq('user_id', user.id);

      if (postsError) throw postsError;

      // Delete comments by the user
      const { error: commentsError } = await supabase
        .from('comments')
        .delete()
        .eq('user_id', user.id);

      if (commentsError) throw commentsError;

      // Delete likes by the user
      const { error: likesError } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id);

      if (likesError) throw likesError;

      toast({
        title: "Account deleted",
        description: "Your account and all data have been deleted.",
      });

      // Sign out the user
      await supabase.auth.signOut();
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="group mr-3 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-all duration-300 hover:scale-105 hover:shadow-md"
          >
            {t('back')}
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{t('user_profile')}</h1>
        </div>

        <Card className="p-8 bg-gradient-card shadow-elegant border-primary/10 mb-8 backdrop-blur-sm">
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-primary/20 ring-offset-4 ring-offset-background">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
                  {profile?.display_name?.charAt(0) || profile?.username?.charAt(0) || user.email?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-background"></div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {profile?.display_name || profile?.username || "User"}
              </h2>
              <p className="text-muted-foreground text-lg">@{profile?.username || "username"}</p>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                {t('email')}
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <Input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="pl-12 h-14 bg-gradient-subtle border-border/50 text-lg disabled:opacity-80"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {t('email_cannot_change')}
              </p>
            </div>

            <form onSubmit={handleUpdateUsername} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  {t('username')}
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-12 h-14 bg-gradient-subtle border-border/50 text-lg focus:border-primary/50 transition-all"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                disabled={loading || !username.trim() || username === profile?.username}
                className="w-full h-12 text-lg font-semibold shadow-medium hover:shadow-elegant transition-all duration-300"
              >
                <Save className="h-5 w-5 mr-2" />
                {loading ? t('updating') : t('update_username')}
              </Button>
            </form>
          </div>
        </Card>

        <Card className="p-8 bg-gradient-card shadow-elegant border-destructive/30 backdrop-blur-sm">
          <div className="flex items-center mb-4">
            <div className="h-2 w-2 bg-destructive rounded-full mr-3 animate-pulse"></div>
            <h3 className="text-xl font-bold text-foreground">{t('danger_zone')}</h3>
          </div>
          <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
            {t('delete_account_warning')}
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full h-12 text-lg font-semibold shadow-medium hover:shadow-elegant transition-all duration-300">
                <Trash2 className="h-5 w-5 mr-2" />
                {t('delete_account')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gradient-card border-destructive/30">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold">{t('delete_confirmation_title')}</AlertDialogTitle>
                <AlertDialogDescription className="text-lg leading-relaxed">
                  {t('delete_confirmation_description')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-12 text-lg font-semibold"
                >
                  {deleteLoading ? t('deleting') : t('yes_delete_account')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;