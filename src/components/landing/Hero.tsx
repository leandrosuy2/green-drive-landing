import { Button } from "@/components/ui/button";
import { Car, ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-car.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Carro moderno disponível para aluguel na KL Rent a Car"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-2xl">
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/30 mb-6 animate-fade-up">
            <Car className="w-4 h-4" />
            <span className="text-sm font-medium">KL Rent a Car</span>
          </div> */}
          
          <h1 
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Aluguel de carros{" "}
            <span className="text-primary">rápido, simples e seguro.</span>
          </h1>
          
          <p 
            className="text-lg md:text-xl text-background/80 mb-8 max-w-xl animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Escolha seu veículo e reserve em minutos. Sem burocracia, sem complicação.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button variant="hero" size="lg">
              Reservar agora
            </Button>
            <Button variant="heroOutline" size="lg">
              Ver frota completa
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#sobre"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-background/60 hover:text-primary transition-colors animate-bounce"
      >
        <span className="text-sm">Saiba mais</span>
        <ChevronDown className="w-5 h-5" />
      </a>
    </section>
  );
};

export default Hero;
