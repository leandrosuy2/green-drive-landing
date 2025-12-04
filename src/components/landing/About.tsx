import { FileCheck, Zap, Car, Globe } from "lucide-react";

const features = [
  {
    icon: FileCheck,
    title: "Sem burocracia",
    description: "Processo simplificado, sem papelada excessiva",
  },
  {
    icon: Zap,
    title: "Atendimento rápido",
    description: "Retire seu carro em poucos minutos",
  },
  {
    icon: Car,
    title: "Carros novos",
    description: "Frota renovada e sempre em perfeito estado",
  },
  {
    icon: Globe,
    title: "100% online",
    description: "Faça tudo pelo celular ou computador",
  },
];

const About = () => {
  return (
    <section id="sobre" className="py-20 md:py-28 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Sobre nós
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
            A <span className="text-primary">KL Rent a Car</span> é a sua escolha certa
          </h2>
          <p className="text-lg text-muted-foreground">
            Somos especializados em locação de veículos com foco em praticidade e excelência. 
            Nossa missão é oferecer a melhor experiência em aluguel de carros, com atendimento 
            personalizado e veículos de qualidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 bg-card rounded-xl shadow-soft hover-lift border border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
