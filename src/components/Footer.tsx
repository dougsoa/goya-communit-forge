import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Heart, 
  Shield, 
  Mail, 
  Github, 
  Twitter,
  Linkedin
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Goya Communit</h3>
            </div>
            <p className="text-background/80 leading-relaxed">
              A collaborative platform for global communities sharing ideas that benefit humanity.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-background hover:text-primary">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Platform
            </h4>
            <nav className="space-y-2" role="navigation" aria-label="Platform links">
              <a href="#discover" className="block text-background/80 hover:text-background transition-smooth">
                Discover Content
              </a>
              <a href="#create" className="block text-background/80 hover:text-background transition-smooth">
                Create & Share
              </a>
              <a href="#communities" className="block text-background/80 hover:text-background transition-smooth">
                Communities
              </a>
              <a href="#api" className="block text-background/80 hover:text-background transition-smooth">
                API Documentation
              </a>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Support
            </h4>
            <nav className="space-y-2" role="navigation" aria-label="Support links">
              <a href="#accessibility" className="block text-background/80 hover:text-background transition-smooth">
                Accessibility
              </a>
              <a href="#privacy" className="block text-background/80 hover:text-background transition-smooth">
                Privacy Policy
              </a>
              <a href="#terms" className="block text-background/80 hover:text-background transition-smooth">
                Terms of Service
              </a>
              <a href="#contact" className="block text-background/80 hover:text-background transition-smooth">
                Contact Us
              </a>
            </nav>
          </div>

          {/* Languages */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Languages
            </h4>
            <div className="space-y-2">
              <p className="text-background/80 text-sm">
                Available in all languages through our integrated translation system.
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="text-primary font-medium">EN</span>
                <span className="text-background/60">•</span>
                <span className="text-background/80">PT</span>
                <span className="text-background/60">•</span>
                <span className="text-background/80">ES</span>
                <span className="text-background/60">•</span>
                <span className="text-background/80">FR</span>
                <span className="text-background/60">•</span>
                <span className="text-background/80">DE</span>
                <span className="text-background/60">•</span>
                <span className="text-background/80">...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-background/80 text-sm">
              <span>© 2025 Goya Communit</span>
              <span>•</span>
              <span>LGPD & GDPR Compliant</span>
              <span>•</span>
              <span>Open Source</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <a 
                href="mailto:hello@goyacommunit.org" 
                className="text-background/80 hover:text-background transition-smooth text-sm"
              >
                hello@goyacommunit.org
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;