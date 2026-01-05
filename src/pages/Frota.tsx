import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Key, Filter, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { frotaService } from "@/services/frotaService";
import { Veiculo } from "@/types/frota";
import { useToast } from "@/hooks/use-toast";
import { encodeId } from "@/lib/encode";
import TopNav from "@/components/landing/TopNav";
import Footer from "@/components/landing/Footer";

interface Filters {
  estado: string;
  grupo: string;
  valorMin: string;
  valorMax: string;
  busca: string;
}

const Frota = () => {
  const [vehicles, setVehicles] = useState<Veiculo[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<Filters>({
    estado: "todos",
    grupo: "todos",
    valorMin: "",
    valorMax: "",
    busca: "",
  });

  // Extrair estados e grupos únicos
  const estados = Array.from(new Set(vehicles.map(v => v.estado))).sort();
  const grupos = Array.from(new Set(vehicles.map(v => v.nome))).sort();

  useEffect(() => {
    const carregarVeiculos = async () => {
      try {
        const data = await frotaService.listarVeiculos();
        setVehicles(data);
        setFilteredVehicles(data);
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

  // Aplicar filtros
  useEffect(() => {
    let result = [...vehicles];

    // Filtro por estado
    if (filters.estado !== "todos") {
      result = result.filter(v => v.estado === filters.estado);
    }

    // Filtro por grupo
    if (filters.grupo !== "todos") {
      result = result.filter(v => v.nome === filters.grupo);
    }

    // Filtro por valor mínimo
    if (filters.valorMin) {
      const min = parseFloat(filters.valorMin);
      result = result.filter(v => parseFloat(v.valorDiaria) >= min);
    }

    // Filtro por valor máximo
    if (filters.valorMax) {
      const max = parseFloat(filters.valorMax);
      result = result.filter(v => parseFloat(v.valorDiaria) <= max);
    }

    // Filtro por busca
    if (filters.busca) {
      const busca = filters.busca.toLowerCase();
      result = result.filter(v => 
        v.nome.toLowerCase().includes(busca) ||
        v.estado.toLowerCase().includes(busca)
      );
    }

    setFilteredVehicles(result);
  }, [filters, vehicles]);

  const limparFiltros = () => {
    setFilters({
      estado: "todos",
      grupo: "todos",
      valorMin: "",
      valorMax: "",
      busca: "",
    });
  };

  const totalFiltrosAtivos = Object.values(filters).filter(v => v && v !== "todos").length;

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nossa Frota <span className="text-primary">Completa</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Encontre o veículo perfeito para sua necessidade. Todos os nossos veículos são 
              revisados e higienizados antes de cada locação.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar de Filtros */}
            <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-primary" />
                      <h2 className="font-heading text-xl font-bold">Filtros</h2>
                      {totalFiltrosAtivos > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                          {totalFiltrosAtivos}
                        </span>
                      )}
                    </div>
                    {totalFiltrosAtivos > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={limparFiltros}
                        className="text-xs"
                      >
                        Limpar
                      </Button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Busca */}
                    <div>
                      <Label htmlFor="busca" className="mb-2 block">
                        Buscar
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="busca"
                          placeholder="Grupo ou cidade..."
                          value={filters.busca}
                          onChange={(e) => setFilters({ ...filters, busca: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Estado */}
                    <div>
                      <Label htmlFor="estado" className="mb-2 block">
                        Estado/Cidade
                      </Label>
                      <Select
                        value={filters.estado}
                        onValueChange={(value) => setFilters({ ...filters, estado: value })}
                      >
                        <SelectTrigger id="estado">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os estados</SelectItem>
                          {estados.map(estado => (
                            <SelectItem key={estado} value={estado}>
                              {estado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Grupo */}
                    <div>
                      <Label htmlFor="grupo" className="mb-2 block">
                        Grupo do Veículo
                      </Label>
                      <Select
                        value={filters.grupo}
                        onValueChange={(value) => setFilters({ ...filters, grupo: value })}
                      >
                        <SelectTrigger id="grupo">
                          <SelectValue placeholder="Selecione o grupo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os grupos</SelectItem>
                          {grupos.map(grupo => (
                            <SelectItem key={grupo} value={grupo}>
                              Grupo {grupo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Faixa de Preço */}
                    <div>
                      <Label className="mb-2 block">Valor da Diária</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="valorMin" className="text-xs text-muted-foreground mb-1 block">
                            Mínimo
                          </Label>
                          <Input
                            id="valorMin"
                            type="number"
                            placeholder="R$ 0"
                            value={filters.valorMin}
                            onChange={(e) => setFilters({ ...filters, valorMin: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="valorMax" className="text-xs text-muted-foreground mb-1 block">
                            Máximo
                          </Label>
                          <Input
                            id="valorMax"
                            type="number"
                            placeholder="R$ 1000"
                            value={filters.valorMax}
                            onChange={(e) => setFilters({ ...filters, valorMax: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Grid de Veículos */}
            <div className="flex-1">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
                  {totalFiltrosAtivos > 0 && ` (${totalFiltrosAtivos})`}
                </Button>
              </div>

              {/* Resultados */}
              <div className="mb-6">
                <p className="text-muted-foreground">
                  {loading ? (
                    'Carregando veículos...'
                  ) : (
                    <>
                      <span className="font-semibold text-foreground">{filteredVehicles.length}</span> 
                      {' '}veículo{filteredVehicles.length !== 1 ? 's' : ''} encontrado{filteredVehicles.length !== 1 ? 's' : ''}
                    </>
                  )}
                </p>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Carregando veículos...</p>
                </div>
              ) : filteredVehicles.length === 0 ? (
                <div className="text-center py-12">
                  <X className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum veículo encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Tente ajustar seus filtros para encontrar mais opções.
                  </p>
                  <Button onClick={limparFiltros} variant="outline">
                    Limpar Filtros
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle, index) => (
                    <Card
                      key={`${vehicle.id}-${vehicle.estadoId}-${index}`}
                      className="group overflow-hidden hover-lift"
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
                      
                      <CardContent className="p-5">
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
                          Reservar Agora
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Frota;
