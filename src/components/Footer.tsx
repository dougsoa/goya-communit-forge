import { Globe, Heart, Users, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";

const Footer = () => {
  return (
    <footer className="mt-16 bg-gradient-subtle border-t">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-6 sm:p-8 bg-gradient-card shadow-soft border-primary/10">
          {/* Header */}
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <Globe className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Goya Community</h2>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center justify-center space-x-2">
              <span>🌍</span>
              <span>Welcome to the Goya Community!</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              <span className="font-medium">👋 We're thrilled to have you here!</span> The Goya Community is a vibrant space where ideas, projects, and reflections come to life. Every voice matters, and every contribution has the power to inspire. <span className="font-medium">🚀✨</span>
            </p>
          </div>

          {/* About Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-foreground mb-3">About Goya Community</h4>
              <p className="text-muted-foreground leading-relaxed">
                Goya is a collaborative platform for creators, thinkers, and innovators passionate about making a positive impact on the world.
              </p>
            </div>

            {/* Mission & Values Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">🌱 Our Mission</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To create a space where ideas flow freely, projects get support, and discoveries spark inspiration. Together, we can tackle some of humanity's greatest challenges in science, medicine, technology, entrepreneurship, and beyond.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">💡 Why You Belong Here</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Whether you're a seasoned expert or just curious, your voice is invaluable. Share your work, join discussions, and be part of a growing repository of knowledge and creativity that benefits everyone.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center space-y-4 pt-6 border-t border-border">
              <p className="text-muted-foreground leading-relaxed">
                We can't wait to see what you create! Start posting, engage with others, and collaborate — the Goya Community comes alive with your participation.
              </p>
              
              <div className="space-y-2">
                <p className="font-medium text-foreground flex items-center justify-center space-x-2">
                  <span>✨</span>
                  <span>The community is now open — the next step is yours!</span>
                </p>
                <p className="text-sm text-muted-foreground flex items-center justify-center space-x-2">
                  <span>📖</span>
                  <span>Share, like, comment, and help us build something extraordinary together.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Brand */}
          <div className="flex items-center justify-center space-x-2 mt-8 pt-6 border-t border-border">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Made with love by the Goya Community</span>
            <Heart className="h-4 w-4 text-primary" />
          </div>
        </Card>
      </div>
    </footer>
  );
};

export default Footer;