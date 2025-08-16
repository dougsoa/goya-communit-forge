import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Heart, Globe, Users } from "lucide-react";
import heroImage from "@/assets/hero-community.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-subtle" role="banner">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium shadow-soft">
                <Heart className="h-4 w-4 mr-2" />
                Global Community Platform
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Share Ideas That{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Transform
                </span>{" "}
                Humanity
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                O Goya Communit nasce como um espaço aberto, inclusivo e colaborativo para quem deseja compartilhar ideias, projetos e descobertas que possam transformar positivamente a nossa realidade.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-foreground">
                Aqui, programadores, cientistas, médicos, biólogos, pensadores e criadores de todas as áreas têm voz. O único requisito é simples:{" "}
                <strong className="text-primary">trazer benefícios para a comunidade global.</strong>
              </p>
              
              <p className="text-muted-foreground">
                Compartilhe. Inspire. Transforme. E faça isso no idioma que preferir — o mundo inteiro pode ouvir a sua voz.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg"
                className="group"
                aria-label="Start sharing your ideas"
              >
                Start Sharing
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-smooth" />
              </Button>
              
              <Button 
                variant="community" 
                size="lg"
                aria-label="Explore communities"
              >
                <Users className="h-5 w-5" />
                Explore Communities
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">∞</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">Global</div>
                <div className="text-sm text-muted-foreground">Reach</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">Open</div>
                <div className="text-sm text-muted-foreground">Source</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <Card className="overflow-hidden shadow-strong bg-gradient-card border-primary/10">
              <div className="aspect-video relative">
                <img 
                  src={heroImage}
                  alt="Diverse hands coming together around a glowing earth, symbolizing global collaboration and community unity"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
            </Card>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-primary shadow-medium animate-pulse" />
            <div className="absolute -bottom-4 -left-4 h-6 w-6 rounded-full bg-primary-glow shadow-medium animate-pulse delay-700" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;