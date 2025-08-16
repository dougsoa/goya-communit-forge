import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Microscope, 
  Stethoscope, 
  Leaf, 
  BookOpen, 
  Lightbulb,
  ArrowRight,
  Users
} from "lucide-react";

const communityAreas = [
  {
    icon: Code,
    title: "Programming",
    description: "Share code, algorithms, and software innovations that solve real-world problems.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    count: "∞"
  },
  {
    icon: Microscope,
    title: "Science",
    description: "Publish research findings, experiments, and scientific discoveries for global impact.",
    color: "text-purple-600", 
    bgColor: "bg-purple-50",
    count: "∞"
  },
  {
    icon: Stethoscope,
    title: "Medicine",
    description: "Share medical insights, treatments, and healthcare innovations to save lives.",
    color: "text-red-600",
    bgColor: "bg-red-50",
    count: "∞"
  },
  {
    icon: Leaf,
    title: "Biology",
    description: "Explore life sciences, environmental solutions, and biological discoveries.",
    color: "text-green-600",
    bgColor: "bg-green-50",
    count: "∞"
  },
  {
    icon: BookOpen,
    title: "Education",
    description: "Create learning resources and educational content for global knowledge sharing.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    count: "∞"
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Share creative ideas, inventions, and solutions that benefit humanity.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    count: "∞"
  }
];

const CommunityAreas = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-subtle" id="communities">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium shadow-soft mb-4">
            <Users className="h-4 w-4 mr-2" />
            Active Communities
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Every{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Field
            </span>{" "}
            Matters
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From programming to medicine, from biology to education - every field of knowledge 
            that benefits humanity has a home here. Join your community and make an impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {communityAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <Card 
                key={index} 
                className="p-6 bg-gradient-card shadow-soft hover:shadow-medium transition-smooth border-primary/5 group cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Explore ${area.title} community`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${area.bgColor} ${area.color} group-hover:scale-110 transition-smooth`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Contributors</div>
                      <div className="text-lg font-bold text-primary">{area.count}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-smooth">
                      {area.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {area.description}
                    </p>
                    
                    <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-smooth">
                      Join Community
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="p-8 bg-accent/30 border-primary/20 shadow-medium max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Don't See Your Field?
            </h3>
            <p className="text-muted-foreground mb-6">
              Goya Communit welcomes all areas of knowledge that contribute positively to humanity. 
              Create your own community space and start sharing your expertise.
            </p>
            <Button variant="hero" size="lg" className="group">
              Create New Community
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-smooth" />
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CommunityAreas;