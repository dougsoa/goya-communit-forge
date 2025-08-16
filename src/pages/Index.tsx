import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CommunityAreas from "@/components/CommunityAreas";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main role="main">
        <Hero />
        <Features />
        <CommunityAreas />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
