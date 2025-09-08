import { Home, User, LogOut, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileBottomNavProps {
  user: any;
  onSignOut: () => void;
}

const MobileBottomNav = ({ user, onSignOut }: MobileBottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
  };

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-primary/95 backdrop-blur-sm border-t border-primary/20 shadow-strong">
        <div className="grid grid-cols-4 h-16">
          {/* Home */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className={`h-full rounded-none flex flex-col items-center justify-center space-y-1 text-primary-foreground hover:bg-white/10 transition-smooth ${
              isActive("/") ? "bg-white/15" : ""
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </Button>

          {/* Profile */}
          {user ? (
            <Button
              variant="ghost"
              onClick={() => navigate("/profile")}
              className={`h-full rounded-none flex flex-col items-center justify-center space-y-1 text-primary-foreground hover:bg-white/10 transition-smooth ${
                isActive("/profile") ? "bg-white/15" : ""
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">Profile</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => navigate("/auth")}
              className="h-full rounded-none flex flex-col items-center justify-center space-y-1 text-primary-foreground hover:bg-white/10 transition-smooth"
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">{t('join')}</span>
            </Button>
          )}

          {/* About */}
          <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="h-full rounded-none flex flex-col items-center justify-center space-y-1 text-primary-foreground hover:bg-white/10 transition-smooth"
              >
                <Info className="h-5 w-5" />
                <span className="text-xs font-medium">About</span>
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center">
                  🌍 Goya Community
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <Card className="p-4 bg-gradient-card">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-primary">
                      Welcome! 👋
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      A vibrant space where ideas, projects, and reflections come to life. Every voice matters! 🚀✨
                    </p>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-2 text-primary">🌱 Our Mission</h4>
                  <p className="text-sm text-muted-foreground">
                    Create a space where ideas flow freely and discoveries spark inspiration for humanity's greatest challenges.
                  </p>
                </Card>

                <Card className="p-4 bg-gradient-subtle">
                  <h4 className="font-semibold mb-2 text-primary">💡 Why You Belong</h4>
                  <p className="text-sm text-muted-foreground">
                    Whether expert or curious, your voice is invaluable. Share, engage, and be part of something extraordinary!
                  </p>
                </Card>

                <Button 
                  onClick={() => setIsAboutOpen(false)}
                  variant="hero"
                  className="w-full"
                >
                  Let's Get Started! 🚀
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Sign Out */}
          {user && (
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="h-full rounded-none flex flex-col items-center justify-center space-y-1 text-primary-foreground hover:bg-white/10 transition-smooth"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-xs font-medium">{t('sign_out')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="h-16" />
    </>
  );
};

export default MobileBottomNav;