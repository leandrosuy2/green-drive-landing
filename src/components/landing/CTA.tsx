import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 sm:mb-6 px-2">
            Pronto para alugar seu carro?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-2">
            Faça sua reserva agora e aproveite as melhores condições do mercado. 
            Atendimento rápido e sem burocracia.
          </p>
          
          <Button 
            size="lg"
            className="bg-background text-primary hover:bg-background/90 shadow-xl hover:shadow-2xl text-sm sm:text-base md:text-lg h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-12 w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Clique aqui e faça sua reserva</span>
            <span className="sm:hidden">Fazer reserva</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex-shrink-0" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
