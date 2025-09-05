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
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-foreground">User Profile</h1>
        </div>

        <Card className="p-6 bg-gradient-card shadow-medium mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {profile?.display_name?.charAt(0) || profile?.username?.charAt(0) || user.email?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {profile?.display_name || profile?.username || "User"}
              </h2>
              <p className="text-muted-foreground">@{profile?.username || "username"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>

            <form onSubmit={handleUpdateUsername} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                disabled={loading || !username.trim() || username === profile?.username}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Updating..." : "Update Username"}
              </Button>
            </form>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-medium border-destructive/20">
          <h3 className="text-lg font-semibold text-foreground mb-4">Danger Zone</h3>
          <p className="text-muted-foreground mb-4">
            Once you delete your account, there is no going back. This will permanently delete your account and all your data.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers, including all your posts, 
                  comments, and likes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteLoading ? "Deleting..." : "Yes, delete my account"}
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