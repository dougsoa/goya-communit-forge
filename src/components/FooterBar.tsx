import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info, Heart, Users, Lightbulb, Target, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

const FooterBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Fixed Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-primary border-t border-primary/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-3">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-primary-foreground hover:bg-white/10 transition-smooth"
                >
                  <Info className="h-4 w-4 mr-2" />
                  About Goya Community
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center mb-2">
                    🌍 Goya Community
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Welcome Section */}
                  <Card className="p-6 bg-gradient-card">
                    <div className="text-center space-y-3">
                      <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Welcome to the Goya Community!
                      </h3>
                      <p className="text-muted-foreground">
                        👋 We're thrilled to have you here! The Goya Community is a vibrant space where ideas, projects, and reflections come to life. Every voice matters, and every contribution has the power to inspire. 🚀✨
                      </p>
                    </div>
                  </Card>

                  {/* About Section */}
                  <Card className="p-6">
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      About Goya Community
                    </h4>
                    <p className="text-muted-foreground">
                      Goya is a collaborative platform for creators, thinkers, and innovators passionate about making a positive impact on the world.
                    </p>
                  </Card>

                  {/* Mission Section */}
                  <Card className="p-6 bg-gradient-subtle">
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-500" />
                      🌱 Our Mission
                    </h4>
                    <p className="text-muted-foreground">
                      To create a space where ideas flow freely, projects get support, and discoveries spark inspiration. Together, we can tackle some of humanity's greatest challenges in science, medicine, technology, entrepreneurship, and beyond.
                    </p>
                  </Card>

                  {/* Why You Belong Section */}
                  <Card className="p-6">
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      💡 Why You Belong Here
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      Whether you're a seasoned expert or just curious, your voice is invaluable. Share your work, join discussions, and be part of a growing repository of knowledge and creativity that benefits everyone.
                    </p>
                    <p className="text-muted-foreground">
                      We can't wait to see what you create! Start posting, engage with others, and collaborate — the Goya Community comes alive with your participation.
                    </p>
                  </Card>

                  {/* Call to Action */}
                  <Card className="p-6 bg-gradient-card text-center">
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold flex items-center justify-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        ✨ The community is now open — the next step is yours!
                      </h4>
                      <p className="text-muted-foreground">
                        📖 Share, like, comment, and help us build something extraordinary together.
                      </p>
                      <Button 
                        onClick={() => setIsOpen(false)}
                        variant="hero"
                        className="mt-4"
                      >
                        Let's Get Started! 🚀
                      </Button>
                    </div>
                  </Card>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      {/* Spacer to prevent content from being hidden behind fixed footer */}
      <div className="h-16" />
    </>
  );
};

export default FooterBar;