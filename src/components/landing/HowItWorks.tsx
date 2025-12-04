import { Car, ClipboardList, Key } from "lucide-react";

const steps = [
  {
    icon: Car,
    number: "01",
    title: "Escolha o carro",
    description: "Navegue pela nossa frota e selecione o veículo ideal para você",
  },
  {
    icon: ClipboardList,
    number: "02",
    title: "Informe seus dados",
    description: "Preencha o formulário simples com suas informações e documentos",
  },
  {
    icon: Key,
    number: "03",
    title: "Retire o veículo",
    description: "Dirija-se ao local de retirada e pegue as chaves do seu carro",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-20 md:py-28 bg-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Passo a passo
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-background mb-6">
            Como <span className="text-primary">funciona?</span>
          </h2>
          <p className="text-lg text-background/70">
            Alugar um carro com a KL Rent a Car é muito simples. Siga os passos abaixo 
            e em minutos você estará pronto para dirigir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative text-center group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-primary/30" />
              )}
              
              <div className="relative z-10">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-background/5 border-2 border-primary/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
                  <div className="relative">
                    <step.icon className="w-12 h-12 text-primary" />
                    <span className="absolute -top-2 -right-4 text-sm font-bold text-primary">
                      {step.number}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-heading text-xl font-bold text-background mb-3">
                  {step.title}
                </h3>
                <p className="text-background/70 max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
