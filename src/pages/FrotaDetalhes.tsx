import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Key, 
  MapPin, 
  Calendar,
  Shield,
  Phone,
  Mail,
  Clock,
  Store
} from "lucide-react";
import { frotaService } from "@/services/frotaService";
import { lojaService } from "@/services/lojaService";
import { planoService } from "@/services/planoService";
import { Veiculo } from "@/types/frota";
import { Loja } from "@/types/loja";
import { Plano } from "@/types/plano";
import { useToast } from "@/hooks/use-toast";
import { decodeId } from "@/lib/encode";
import TopNav from "@/components/landing/TopNav";
import Footer from "@/components/landing/Footer";

const FrotaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vehicle, setVehicle] = useState<Veiculo | null>(null);
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [lojaSelecionada, setLojaSelecionada] = useState<string>("");
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [planoSelecionado, setPlanoSelecionado] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [tipoLocacao, setTipoLocacao] = useState<"convencional" | "promocional">("convencional");
  const [tipoSeguro, setTipoSeguro] = useState<"basico" | "premium">("basico");
  const [dataRetirada, setDataRetirada] = useState<string>("");
  const [dataDevolucao, setDataDevolucao] = useState<string>("");

  // Função para calcular próximo dia útil (não domingo)
  const getProximoDiaUtil = (date: Date): Date => {
    const novaDdata = new Date(date);
    if (novaDdata.getDay() === 0) { // Se for domingo
      novaDdata.setDate(novaDdata.getDate() + 1); // Vai para segunda
    }
    return novaDdata;
  };

  // Inicializar data de retirada como amanhã (excluindo domingo)
  useEffect(() => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const dataUtil = getProximoDiaUtil(amanha);
    const dataFormatada = dataUtil.toISOString().split('T')[0];
    setDataRetirada(dataFormatada);
    
    // Inicializar data de devolução como um dia depois da retirada
    const devolucao = new Date(dataUtil);
    devolucao.setDate(devolucao.getDate() + 1);
    const dataDevolucaoUtil = getProximoDiaUtil(devolucao);
    const dataDevolucaoFormatada = dataDevolucaoUtil.toISOString().split('T')[0];
    setDataDevolucao(dataDevolucaoFormatada);
  }, []);

  // Atualizar data de devolução quando data de retirada mudar ou plano mudar
  useEffect(() => {
    if (dataRetirada) {
      const retirada = new Date(dataRetirada + 'T00:00:00');
      const devolucao = new Date(retirada);
      
      // Se for promocional e tiver plano selecionado, usa qtdMinDias
      if (tipoLocacao === "promocional" && planoSelecionado && planos.length > 0) {
        const plano = planos.find(p => String(p.id) === planoSelecionado);
        if (plano) {
          devolucao.setDate(devolucao.getDate() + plano.qtdMinDias);
        } else {
          devolucao.setDate(devolucao.getDate() + 1);
        }
      } else {
        devolucao.setDate(devolucao.getDate() + 1);
      }
      
      const dataDevolucaoUtil = getProximoDiaUtil(devolucao);
      const dataDevolucaoFormatada = dataDevolucaoUtil.toISOString().split('T')[0];
      
      // No promocional, sempre atualiza. No convencional, só se for anterior
      if (tipoLocacao === "promocional") {
        setDataDevolucao(dataDevolucaoFormatada);
      } else {
        const devolucaoAtual = new Date(dataDevolucao + 'T00:00:00');
        if (!dataDevolucao || devolucaoAtual <= retirada) {
          setDataDevolucao(dataDevolucaoFormatada);
        }
      }
    }
  }, [dataRetirada, tipoLocacao, planoSelecionado, planos]);

  // Validar que a data não seja domingo
  const validarData = (dataStr: string): boolean => {
    const data = new Date(dataStr + 'T00:00:00');
    return data.getDay() !== 0; // Retorna false se for domingo
  };

  const handleDataRetiradaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novaData = e.target.value;
    if (validarData(novaData)) {
      setDataRetirada(novaData);
    } else {
      toast({
        variant: "destructive",
        title: "Data inválida",
        description: "A data de retirada não pode ser um domingo.",
      });
    }
  };

  const handleDataDevolucaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novaData = e.target.value;
    
    // Validar que não seja a mesma data da retirada
    if (novaData === dataRetirada) {
      toast({
        variant: "destructive",
        title: "Data inválida",
        description: "A data de devolução não pode ser igual à data de retirada.",
      });
      return;
    }
    
    if (validarData(novaData)) {
      setDataDevolucao(novaData);
    } else {
      toast({
        variant: "destructive",
        title: "Data inválida",
        description: "A data de devolução não pode ser um domingo.",
      });
    }
  };

  // Calcular quantidade de diárias
  const calcularDiarias = (): number => {
    if (!dataRetirada || !dataDevolucao) return 0;
    const inicio = new Date(dataRetirada + 'T00:00:00');
    const fim = new Date(dataDevolucao + 'T00:00:00');
    const diffTime = Math.abs(fim.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calcular valor da diária (com seguro)
  const calcularValorDiaria = (): number => {
    if (!vehicle) return 0;
    
    // Se for promocional, calcula baseado no plano com seguro
    if (tipoLocacao === "promocional" && planoSelecionado && planos.length > 0) {
      const plano = planos.find(p => String(p.id) === planoSelecionado);
      if (plano && plano.qtdMinDias > 0) {
        const valorBase = parseFloat(plano.valorPretendido);
        
        if (tipoSeguro === "basico") {
          // Básico: valorPretendido / qtdMinDias
          return valorBase / plano.qtdMinDias;
        } else {
          // Premium: (valorPretendido + adicional) / qtdMinDias
          const adicionalPremium = valorBase * 0.24375;
          return (valorBase + adicionalPremium) / plano.qtdMinDias;
        }
      }
    }
    
    // Cálculo convencional com seguro
    const valorBase = parseFloat(vehicle.valorLocacao);
    const percentualSeguro = tipoSeguro === "basico" 
      ? parseFloat(vehicle.seguroBasico || "0")
      : parseFloat(vehicle.seguroPlus || "0");
    
    const valorSeguro = (valorBase * percentualSeguro) / 100;
    return valorBase + valorSeguro;
  };

  // Calcular valor final com seguro e diárias
  const calcularValorFinal = () => {
    const diarias = calcularDiarias();
    
    // Se for promocional e tiver plano selecionado
    if (tipoLocacao === "promocional" && planoSelecionado && planos.length > 0) {
      const plano = planos.find(p => String(p.id) === planoSelecionado);
      if (plano && diarias >= plano.qtdMinDias) {
        const valorBase = parseFloat(plano.valorPretendido);
        
        // No promocional, o seguro é aplicado sobre o valor pretendido total
        if (tipoSeguro === "basico") {
          // Básico: valor pretendido sem alteração
          return valorBase.toFixed(2);
        } else {
          // Premium: valor pretendido + 24.375% (diferença para chegar ao premium)
          // Cálculo: 2400 + (2400 * 0.24375) = 2985
          const adicionalPremium = valorBase * 0.24375;
          return (valorBase + adicionalPremium).toFixed(2);
        }
      }
    }
    
    // Cálculo convencional
    const valorDiaria = calcularValorDiaria();
    const total = valorDiaria * diarias;
    return total > 0 ? total.toFixed(2) : "0";
  };

  useEffect(() => {
    const carregarDetalhes = async () => {
      if (!id) {
        navigate("/frota");
        return;
      }

      const decoded = decodeId(id);
      if (!decoded) {
        toast({
          variant: "destructive",
          title: "Link inválido",
          description: "Não foi possível carregar os detalhes do veículo.",
        });
        navigate("/frota");
        return;
      }

      try {
        
        // Buscar lojas com base no estadoId
        const lojasData = await lojaService.listarLojas(decoded.estadoId);
        setLojas(lojasData);
        
        // Selecionar primeira loja por padrão
        if (lojasData.length > 0) {
          setLojaSelecionada(String(lojasData[0].id));
        }
        
        const data = await frotaService.buscarVeiculoPorId(decoded.id, decoded.estadoId);
        setVehicle(data);
        
        // Buscar planos promocionais
        const planosData = await planoService.listarPlanos(decoded.id, decoded.estadoId);
        console.log('Planos recebidos:', planosData);
        setPlanos(planosData);
        
        // Selecionar primeiro plano por padrão
        if (planosData.length > 0) {
          setPlanoSelecionado(String(planosData[0].id));
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar detalhes",
          description: "Não foi possível carregar as informações do veículo.",
        });
        navigate("/frota");
      } finally {
        setLoading(false);
      }
    };

    carregarDetalhes();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando detalhes...</p>
      </div>
    );
  }

  if (!vehicle) {
    return null;
  }

  const beneficios = [
    { icon: Shield, label: "Seguro Incluso", desc: "Proteção total durante a locação" },
    { icon: Clock, label: "Atendimento 24h", desc: "Suporte a qualquer momento" },
    { icon: Calendar, label: "Sem Multa", desc: "Cancele com até 24h de antecedência" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Button
            variant="ghost"
            className="mb-6 -ml-4"
            onClick={() => navigate("/frota")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para frota
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Imagem */}
            <div>
              {/* Informações do Grupo */}
              <div className="mb-4">
                <h2 className="text-3xl font-bold mb-2">{vehicle.estado?.sigla || 'B'}</h2>
                <p className="text-muted-foreground mb-1">{vehicle.descricao}</p>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{vehicle.estado?.nome || 'Manaus'}</span>
                </div>
              </div>
              
              <Separator className="mb-4" />
              
              <Card className="overflow-hidden">
                <div className="relative bg-muted aspect-video">
                  <img
                    src={`/${vehicle.imagem}`}
                    alt={`${vehicle.nome} disponível para alugar`}
                    className="w-full h-full object-contain p-8"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop';
                    }}
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    {vehicle.nome}
                  </Badge>
                </div>
              </Card>

              {/* Benefícios */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {beneficios.map((beneficio, index) => {
                  const Icon = beneficio.icon;
                  return (
                    <Card key={index} className="text-center">
                      <CardContent className="p-4">
                        <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="font-semibold text-sm">{beneficio.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {beneficio.desc}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Botões de Contato */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button variant="outline" size="lg" className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Phone className="w-5 h-5 mr-2" />
                  Ligar
                </Button>
                <Button variant="outline" size="lg" className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Mail className="w-5 h-5 mr-2" />
                  Email
                </Button>
              </div>

              {/* Informações Importantes */}
              <Card className="mt-6 bg-muted/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Shield className="w-5 h-5 text-primary mt-1" />
                    <h3 className="text-lg font-semibold">Informações Importantes</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• CNH válida há pelo menos 2 anos</li>
                    <li>• Idade mínima: 21 anos</li>
                    <li>• Documentos: RG, CPF e comprovante de residência</li>
                    <li>• Cartão de crédito para caução</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Informações */}
            <div>
              <div className="space-y-6">
                {/* Preços */}
                <Card className="border-2 border-primary/20">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Seleção de Loja */}
                      <div>
                        <Label htmlFor="loja" className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Store className="w-4 h-4" />
                          Loja de Retirada
                        </Label>
                        <Select value={lojaSelecionada} onValueChange={setLojaSelecionada}>
                          <SelectTrigger id="loja" className="w-full">
                            <SelectValue placeholder="Selecione a loja" />
                          </SelectTrigger>
                          <SelectContent>
                            {lojas.map((loja) => (
                              <SelectItem key={loja.id} value={String(loja.id)}>
                                {loja.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium">Valor da Diária</span>
                        </div>
                        <span className="text-2xl font-bold text-foreground">
                          R$ {vehicle.valorLocacao}
                        </span>
                      </div>
                      
                      <Separator />

                      {/* Tipo de Locação */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTipoLocacao("convencional")}
                          className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                            tipoLocacao === "convencional"
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          Convencional
                        </button>
                        <button
                          onClick={() => setTipoLocacao("promocional")}
                          className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                            tipoLocacao === "promocional"
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          Promocional
                        </button>
                      </div>
                      
                      <Separator />

                      {/* Seleção de Plano Promocional */}
                      {tipoLocacao === "promocional" && planos.length > 0 && (
                        <>
                          <div>
                            <Label htmlFor="plano" className="flex items-center gap-2 mb-2">
                              <Shield className="w-4 h-4" />
                              Escolha o Plano Promocional
                            </Label>
                            <Select value={planoSelecionado} onValueChange={setPlanoSelecionado}>
                              <SelectTrigger id="plano" className="w-full">
                                <SelectValue placeholder="Selecione um plano" />
                              </SelectTrigger>
                              <SelectContent>
                                {planos.map((plano) => (
                                  <SelectItem key={plano.id} value={String(plano.id)}>
                                    {plano.titulo} - {plano.qtdMinDias} dias (Valor R$ {parseFloat(plano.valorPretendido).toFixed(2)})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {planoSelecionado && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {planos.find(p => String(p.id) === planoSelecionado)?.observacao || 'Plano promocional selecionado'}
                              </p>
                            )}
                          </div>
                          
                          <Separator />
                        </>
                      )}

                      {/* Tipo de Seguro */}
                      <div>
                        <p className="text-sm font-medium mb-2">Escolha o Seguro</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setTipoSeguro("basico")}
                            className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                              tipoSeguro === "basico"
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            Seguro Básico
                          </button>
                          <button
                            onClick={() => setTipoSeguro("premium")}
                            className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                              tipoSeguro === "premium"
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            Seguro Premium
                          </button>
                        </div>
                      </div>
                      
                      <Separator />

                      {/* Datas de Retirada e Devolução */}
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="dataRetirada" className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4" />
                            Data de Retirada
                          </Label>
                          <Input
                            id="dataRetirada"
                            type="date"
                            value={dataRetirada}
                            onChange={handleDataRetiradaChange}
                            min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground mt-1">* Domingos não estão disponíveis</p>
                        </div>

                        <div>
                          <Label htmlFor="dataDevolucao" className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4" />
                            Data de Devolução
                          </Label>
                          <Input
                            id="dataDevolucao"
                            type="date"
                            value={dataDevolucao}
                            onChange={handleDataDevolucaoChange}
                            min={dataRetirada || new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0]}
                            className="w-full"
                            disabled={tipoLocacao === "promocional"}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {tipoLocacao === "promocional" 
                              ? "* Calculada automaticamente pelo plano selecionado"
                              : "* Domingos não estão disponíveis"
                            }
                          </p>
                        </div>
                      </div>
                      
                      {/* Bloco amarelo com Diárias e Valor da Diária */}
                      <div className="flex items-center justify-between p-4 bg-yellow-400/20 border-2 border-yellow-400 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-yellow-600" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-yellow-900">Quantidade de Diárias</span>
                            <span className="text-xl font-bold text-yellow-700">{calcularDiarias()} {calcularDiarias() === 1 ? 'dia' : 'dias'}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-medium text-yellow-900">Valor da Diária</span>
                          <span className="text-xl font-bold text-yellow-700">R$ {calcularValorDiaria().toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Key className="w-5 h-5 text-primary" />
                          <span className="font-medium">Valor Total</span>
                        </div>
                        <span className="text-2xl font-bold text-primary">
                          R$ {calcularValorFinal()}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        * Preços sujeitos a disponibilidade e período de locação
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA */}
                <div className="space-y-3">
                  <Button size="lg" className="w-full text-lg h-14">
                    <Calendar className="w-5 h-5 mr-2" />
                    Reservar Agora
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FrotaDetalhes;
