import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, Menu, Search, User } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center">
            <Globe className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            Goya Communit
          </h1>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Primary navigation">
          <a 
            href="#discover" 
            className="text-muted-foreground hover:text-foreground transition-smooth font-medium"
            aria-label="Discover content"
          >
            Discover
          </a>
          <a 
            href="#create" 
            className="text-muted-foreground hover:text-foreground transition-smooth font-medium"
            aria-label="Create content"
          >
            Create
          </a>
          <a 
            href="#communities" 
            className="text-muted-foreground hover:text-foreground transition-smooth font-medium"
            aria-label="Browse communities"
          >
            Communities
          </a>
          <a 
            href="#about" 
            className="text-muted-foreground hover:text-foreground transition-smooth font-medium"
            aria-label="About us"
          >
            About
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <Button 
            variant="ghost" 
            size="sm"
            aria-label="Change language"
            className="hidden sm:flex"
          >
            <Globe className="h-4 w-4" />
            EN
          </Button>

          {/* Search */}
          <Button 
            variant="ghost" 
            size="icon"
            aria-label="Search"
            className="hidden sm:flex"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <Button 
            variant="community" 
            size="sm"
            aria-label="User menu"
          >
            <User className="h-4 w-4" />
            Join
          </Button>

          {/* Mobile Menu */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            aria-label="Open mobile menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;