import { Card } from "@/components/ui/card";
import { 
  Shield, 
  Globe, 
  Users, 
  BookOpen, 
  Zap, 
  Heart,
  Eye,
  Mic
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Multilingual Platform",
    description: "Write and read in any language with our integrated translation system. Your voice reaches the global community.",
    color: "text-blue-600"
  },
  {
    icon: Eye,
    title: "Fully Accessible",
    description: "WCAG 2.2 compliant design ensuring everyone can participate, including screen reader support and keyboard navigation.",
    color: "text-green-600"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "LGPD and GDPR compliant with robust security measures. Your data is protected with enterprise-grade encryption.",
    color: "text-purple-600"
  },
  {
    icon: Users,
    title: "Collaborative Community",
    description: "Connect with programmers, scientists, doctors, biologists, and thinkers from every field imaginable.",
    color: "text-primary"
  },
  {
    icon: BookOpen,
    title: "Knowledge Sharing",
    description: "Share articles, ideas, and discoveries with advanced search, tagging, and recommendation systems.",
    color: "text-orange-600"
  },
  {
    icon: Zap,
    title: "Modern Interface",
    description: "Clean, intuitive design that reduces cognitive load while maximizing collaboration and creativity.",
    color: "text-yellow-600"
  }
];

const Features = () => {
  return (
    <section className="py-16 lg:py-24 bg-background" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium shadow-soft mb-4">
            <Heart className="h-4 w-4 mr-2" />
            Built for Everyone
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Inclusive by{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Design
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every feature is crafted with accessibility, security, and global collaboration in mind. 
            We believe knowledge should be accessible to everyone, everywhere.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="p-6 bg-gradient-card shadow-soft hover:shadow-medium transition-smooth border-primary/5 group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-accent/50 ${feature.color} group-hover:scale-110 transition-smooth`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Accessibility Statement */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-accent/30 border-primary/20 shadow-soft max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Mic className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-2xl font-bold text-foreground">
                Accessibility Commitment
              </h3>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Goya Communit is designed for people with disabilities including those who are blind, 
              deaf, or have mobility impairments. We support screen readers, provide automatic captions, 
              ensure proper color contrast, and offer full keyboard navigation.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;