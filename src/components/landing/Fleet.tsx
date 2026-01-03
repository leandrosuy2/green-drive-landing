import { Button } from "@/components/ui/button";
import { MapPin, Key } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { frotaService } from "@/services/frotaService";
import { Veiculo } from "@/types/frota";
import { useToast } from "@/hooks/use-toast";
import { encodeId } from "@/lib/encode";

const Fleet = () => {
  const [vehicles, setVehicles] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const carregarVeiculos = async () => {
      try {
        const data = await frotaService.listarVeiculos();
        // Agrupa por nome único (pega apenas um de cada grupo)
        const veiculosUnicos = data.reduce((acc: Veiculo[], veiculo) => {
          if (!acc.find(v => v.nome === veiculo.nome)) {
            acc.push(veiculo);
          }
          return acc;
        }, []);
        setVehicles(veiculosUnicos.slice(0, 4)); // Mostra apenas 4 grupos
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar frota",
          description: "Não foi possível carregar os veículos disponíveis.",
        });
      } finally {
        setLoading(false);
      }
    };

    carregarVeiculos();
  }, [toast]);
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

        {loading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Carregando veículos...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Nenhum veículo disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles.map((vehicle, index) => (
              <div
                key={`${vehicle.id}-${vehicle.estadoId}-${index}`}
                className="group bg-card rounded-xl overflow-hidden shadow-soft hover-lift border border-border/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={`/${vehicle.imagem}`}
                    alt={`Grupo ${vehicle.nome} disponível para alugar`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop';
                    }}
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    Grupo {vehicle.nome}
                  </span>
                </div>
                
                <div className="p-5">
                  <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                    Grupo {vehicle.nome}
                  </h3>
                  {vehicle.descricao && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {vehicle.descricao}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-foreground text-base">R$ {vehicle.valorLocacao}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-xs">{vehicle.estado}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => {
                      const encoded = encodeId(vehicle.id, vehicle.estadoId);
                      navigate(`/frota/${encoded}`);
                    }}
                  >
                    Reservar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.location.href = '/frota'}
          >
            Ver todos os veículos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Fleet;
