import TopNav from "@/components/landing/TopNav";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Fleet from "@/components/landing/Fleet";
import HowItWorks from "@/components/landing/HowItWorks";
import Benefits from "@/components/landing/Benefits";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <TopNav />
      <Header />
      <Hero />
      <About />
      <Fleet />
      <HowItWorks />
      <Benefits />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
