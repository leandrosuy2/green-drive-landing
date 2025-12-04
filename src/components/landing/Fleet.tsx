import { Button } from "@/components/ui/button";
import { Users, Fuel, Settings } from "lucide-react";

const vehicles = [
  {
    id: 1,
    name: "Fiat Mobi",
    category: "Econômico",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
    seats: 5,
    fuel: "Flex",
    transmission: "Manual",
  },
  {
    id: 2,
    name: "Hyundai HB20",
    category: "Compacto",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop",
    seats: 5,
    fuel: "Flex",
    transmission: "Automático",
  },
  {
    id: 3,
    name: "Toyota Corolla",
    category: "Sedan",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&h=300&fit=crop",
    seats: 5,
    fuel: "Híbrido",
    transmission: "Automático",
  },
  {
    id: 4,
    name: "Jeep Compass",
    category: "SUV",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop",
    seats: 5,
    fuel: "Diesel",
    transmission: "Automático",
  },
];

const Fleet = () => {
  return (
    <section id="frota" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Nossa Frota
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
            Veículos para <span className="text-primary">todas as necessidades</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Escolha o carro ideal para sua viagem. Todos os nossos veículos são revisados e 
            higienizados antes de cada locação.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className="group bg-card rounded-xl overflow-hidden shadow-soft hover-lift border border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={`${vehicle.name} disponível para alugar`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  {vehicle.category}
                </span>
              </div>
              
              <div className="p-5">
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                  {vehicle.name}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{vehicle.seats}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="w-4 h-4" />
                    <span>{vehicle.fuel}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Settings className="w-4 h-4" />
                    <span>{vehicle.transmission}</span>
                  </div>
                </div>
                
                <Button variant="default" className="w-full">
                  Reservar
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Ver todos os veículos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Fleet;
