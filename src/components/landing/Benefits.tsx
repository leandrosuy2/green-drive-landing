import { CheckCircle, Headphones, DollarSign, Shield } from "lucide-react";

const benefits = [
  {
    icon: CheckCircle,
    title: "Carros revisados",
    description: "Todos os veículos passam por rigorosa revisão mecânica e de segurança antes de cada locação",
  },
  {
    icon: Headphones,
    title: "Suporte 24h",
    description: "Atendimento disponível a qualquer hora do dia ou da noite para emergências",
  },
  {
    icon: DollarSign,
    title: "Preço competitivo",
    description: "Oferecemos as melhores tarifas do mercado sem comprometer a qualidade",
  },
  {
    icon: Shield,
    title: "Confiança e transparência",
    description: "Sem taxas escondidas. Você sabe exatamente o que está pagando",
  },
];

const Benefits = () => {
  return (
    <section id="beneficios" className="py-20 md:py-28 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Por que nos escolher?
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Benefícios que fazem a <span className="text-primary">diferença</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Na KL Rent a Car, você encontra mais do que carros para alugar. Encontra uma 
              experiência completa, pensada para sua comodidade e segurança.
            </p>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="flex gap-4 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                    <benefit.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-card">
              <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=800&fit=crop"
                alt="Cliente satisfeito com carro alugado da KL Rent a Car"
                className="w-full h-[500px] object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/30 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
