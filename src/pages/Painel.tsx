import locacaoService, { Locacao } from "@/services/locacaoService";
import ListaDocVeiculos from "./ListaDocVeiculos";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authService } from "@/services/authService";
import { reservaService } from "@/services/reservaService";
import { CancelReservationModal } from "@/components/landing/CancelReservationModal";
import { useToast } from "@/hooks/use-toast";
import { ReservaResponse } from "@/types/reserva";
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Menu,
  X,
  TrendingUp,
  DollarSign,
  Calendar,
  Activity,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const Painel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [locacoes, setLocacoes] = useState<Locacao[]>([]);
  const [loadingLocacoes, setLoadingLocacoes] = useState(false);
  const [user, setUser] = useState(authService.getUser());
  const [reservas, setReservas] = useState<ReservaResponse[]>([]);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [reservaIdParaCancelar, setReservaIdParaCancelar] = useState<number | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (activeMenu === "frota") {
      setLoadingLocacoes(true);
      locacaoService.listarLocacoes()
        .then(setLocacoes)
        .catch(() => setLocacoes([]))
        .finally(() => setLoadingLocacoes(false));
    }
  }, [activeMenu]);
  // Abrir modal de cancelamento
  const abrirModalCancelar = (idReserva: number) => {
    setReservaIdParaCancelar(idReserva);
    setCancelModalOpen(true);
  };

  // Cancelar reserva
  const handleCancelarReserva = async (motivo: string) => {
    if (!reservaIdParaCancelar) return;
    setCancelLoading(true);
    try {
      await reservaService.cancelarReserva(reservaIdParaCancelar, motivo);
      toast({
        title: "Reserva cancelada",
        description: "A reserva foi cancelada com sucesso.",
      });
      setCancelModalOpen(false);
      setReservaIdParaCancelar(null);
      carregarReservas();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao cancelar",
        description: error.response?.data?.message || "Não foi possível cancelar a reserva.",
      });
    } finally {
      setCancelLoading(false);
    }
  };

  useEffect(() => {
    // Verificar se está autenticado
    if (!authService.isAuthenticated()) {
      window.location.href = "/";
      return;
    }

    // Garantir que o user está atualizado
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
    }

    // Listener para mudanças no localStorage
    const handleStorageChange = () => {
      const updatedUser = authService.getUser();
      setUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/";
  };

  const carregarReservas = async () => {
    try {
      setLoadingReservas(true);
      // Buscar todas as reservas (admin ou painel)
      const data = await reservaService.listarReservas();
      setReservas(data);
    } catch (error) {
      console.error("Erro ao carregar reservas:", error);
    } finally {
      setLoadingReservas(false);
    }
  };

  useEffect(() => {
    if (activeMenu === "reservas") {
      carregarReservas();
    }
  }, [activeMenu]);

  const getStatusBadge = (status: ReservaResponse["status"]) => {
    const statusConfig = {
      pendente: {
        label: "Pendente",
        icon: AlertCircle,
        className: "bg-yellow-500 text-white"
      },
      confirmada: {
        label: "Confirmada",
        icon: CheckCircle,
        className: "bg-green-500 text-white"
      },
      cancelada: {
        label: "Cancelada",
        icon: XCircle,
        className: "bg-red-500 text-white"
      },
      concluida: {
        label: "Concluída",
        icon: CheckCircle,
        className: "bg-blue-500 text-white"
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR");
  };

  const formatarDataHora = (data: string) => {
    const date = new Date(data);
    return date.toLocaleString("pt-BR");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "frota", label: "Locação", icon: Car },
    { id: "reservas", label: "Reservas", icon: Calendar },
    { id: "manutencao", label: "Manutenção", icon: Activity },
    { id: "veiculos", label: "Doc Veículos", icon: FileText },
    { id: "boletos", label: "Boletos", icon: DollarSign },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ];

  const stats = [
    { 
      title: "Reservas Ativas", 
      value: "28", 
      change: "+12%", 
      icon: Calendar,
      color: "text-blue-600 bg-blue-100"
    },
    { 
      title: "Veículos Disponíveis", 
      value: "42", 
      change: "+5%", 
      icon: Car,
      color: "text-green-600 bg-green-100"
    },
    { 
      title: "Receita Mensal", 
      value: "R$ 45.2k", 
      change: "+18%", 
      icon: DollarSign,
      color: "text-purple-600 bg-purple-100"
    },
    { 
      title: "Taxa de Ocupação", 
      value: "67%", 
      change: "+8%", 
      icon: TrendingUp,
      color: "text-orange-600 bg-orange-100"
    },
  ];

  const recentActivity = [
    { action: "Nova reserva", client: "João Silva", vehicle: "Grupo B", time: "há 5 min" },
    { action: "Devolução", client: "Maria Santos", vehicle: "Grupo D", time: "há 15 min" },
    { action: "Reserva cancelada", client: "Pedro Costa", vehicle: "Grupo C", time: "há 1 hora" },
    { action: "Nova reserva", client: "Ana Paula", vehicle: "Grupo G/a", time: "há 2 horas" },
  ];

  // Telas base para cada menu
  const ListaLocacao = () => (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Locações</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-4">Visualize e gerencie suas locações.</p>
      {loadingLocacoes ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando locações...</p>
        </div>
      ) : locacoes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-400">
            <Car className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma locação encontrada</h3>
            <p className="text-gray-500">Você ainda não possui locações cadastradas.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {locacoes.map((loc) => (
            <Card key={loc.id_loc} className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gray-50 p-3 sm:p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <CardTitle className="text-base sm:text-lg md:text-xl truncate">{loc.modelo_car} ({loc.placa_car})</CardTitle>
                      <span className="text-xs bg-emerald-100 text-emerald-700 rounded px-2 py-1 whitespace-nowrap">{loc.nome_marca}</span>
                      {loc.dataDevolucao === null || loc.dataDevolucao === undefined ? (
                        <span className="text-xs bg-green-100 text-green-800 rounded px-2 py-1 whitespace-nowrap">Aberta</span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-700 rounded px-2 py-1 whitespace-nowrap">Fechada</span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Categoria: {loc.descricao_ctg}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-xs sm:text-sm">Data Locação:</span>
                      <span className="text-xs sm:text-sm">{new Date(loc.dataLoc).toLocaleString("pt-BR")}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-xs sm:text-sm">Previsão Devolução:</span>
                      <span className="text-xs sm:text-sm">{new Date(loc.dataPrev).toLocaleString("pt-BR")}</span>
                    </div>
                    {loc.dataDevolucao && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="font-medium text-xs sm:text-sm">Data Devolução:</span>
                        <span className="text-xs sm:text-sm">{new Date(loc.dataDevolucao).toLocaleString("pt-BR")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const ListaReservas = ({ reservas, loadingReservas }) => (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Minhas Reservas</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-4">Visualize e gerencie suas reservas de veículos.</p>
      {loadingReservas ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando reservas...</p>
        </div>
      ) : reservas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-400">
            <Calendar className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma reserva encontrada</h3>
            <p className="text-gray-500">Você ainda não possui reservas cadastradas.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {[...reservas]
            .sort((a, b) => b.id - a.id)
            .map((reserva) => (
            <Card key={reserva.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gray-50 p-3 sm:p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <CardTitle className="text-base sm:text-lg md:text-xl">Reserva #{reserva.id}</CardTitle>
                      {getStatusBadge(reserva.status)}
                      {reserva.status === "pendente" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="text-xs sm:text-sm"
                          onClick={() => abrirModalCancelar(reserva.id)}
                          disabled={cancelLoading && reservaIdParaCancelar === reserva.id}
                        >
                          Cancelar
                        </Button>
                      )}
                          <CancelReservationModal
                            open={cancelModalOpen}
                            onClose={() => setCancelModalOpen(false)}
                            onCancel={handleCancelarReserva}
                            loading={cancelLoading}
                          />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Registrada em {formatarDataHora(reserva.dataRegistro)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Coluna Esquerda */}
                  <div className="space-y-4">
                    {/* Veículo */}
                    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={`/${reserva.grupo.imagem}`}
                          alt={reserva.grupo.nome}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=200&fit=crop';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Car className="w-4 h-4 text-primary" />
                          <span className="font-semibold">{reserva.grupo.nome}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Shield className={`w-3 h-3 ${reserva.seguro === "1" ? "text-blue-500" : reserva.seguro === "2" ? "text-yellow-500" : "text-gray-400"}`} />
                          {reserva.seguro === "1" && (
                            <span className="font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Seguro Básico</span>
                          )}
                          {reserva.seguro === "2" && (
                            <span className="font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">Seguro Premium</span>
                          )}
                          {reserva.seguro !== "1" && reserva.seguro !== "2" && (
                            <span className="text-gray-500">Sem seguro</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Categoria: <span className="capitalize">{reserva.categoria}</span>
                        </div>
                      </div>
                    </div>

                    {/* Loja */}
                    <div className="p-3 sm:p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="font-semibold text-sm sm:text-base">Loja de Retirada</span>
                      </div>
                      <p className="text-xs sm:text-sm">{reserva.lojaRetirada.nome}</p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {reserva.lojaRetirada.cidade} - {reserva.lojaRetirada.estado}
                      </p>
                    </div>
                  </div>

                  {/* Coluna Direita */}
                  <div className="space-y-4">
                    {/* Período */}
                    <div className="p-3 sm:p-4 border rounded-lg bg-primary/5">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="font-semibold text-sm sm:text-base">Período de Locação</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Retirada</p>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                            <Calendar className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="font-medium text-xs sm:text-sm">
                              {formatarData(reserva.periodo.retirada.data)}
                            </span>
                            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-600">
                              {reserva.periodo.retirada.hora}
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-600 mb-1">Devolução</p>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                            <Calendar className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <span className="font-medium text-xs sm:text-sm">
                              {formatarData(reserva.periodo.devolucao.data)}
                            </span>
                            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-600">
                              {reserva.periodo.devolucao.hora}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total de dias:</span>
                          <span className="font-bold text-lg text-primary">
                            {reserva.qtdDias} {reserva.qtdDias === 1 ? 'dia' : 'dias'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Informações Adicionais */}
                    <div className="p-3 sm:p-4 border rounded-lg space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Origem:</span>
                        <span className="font-medium capitalize">{reserva.origem}</span>
                      </div>
                      {reserva.planoId > 0 && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Plano:</span>
                          <span className="font-medium">#{reserva.planoId}</span>
                        </div>
                      )}
                      {reserva.valorDoado && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Valor Doado:</span>
                          <span className="font-medium text-green-600">
                            R$ {parseFloat(reserva.valorDoado).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Cancelamento */}
                    {reserva.cancelamento && (
                      <div className="p-3 sm:p-4 border border-red-200 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <span className="font-semibold text-red-900 text-sm sm:text-base">Cancelamento</span>
                        </div>
                        <p className="text-xs sm:text-sm text-red-800 mb-1">
                          Data: {formatarDataHora(reserva.cancelamento.data)}
                        </p>
                        <p className="text-xs sm:text-sm text-red-700">
                          Motivo: {reserva.cancelamento.motivo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const ListaManutencao = () => (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Manutenção</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-4">Visualize e gerencie as manutenções dos veículos.</p>
      <Card>
        <CardContent className="py-12 text-center text-gray-400">
          <Activity className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhuma manutenção cadastrada</h3>
          <p className="text-gray-500">Nenhuma manutenção registrada até o momento.</p>
        </CardContent>
      </Card>
    </div>
  );

  const ListaBoletos = () => (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Boletos</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-4">Visualize e gerencie seus boletos.</p>
      <Card>
        <CardContent className="py-12 text-center text-gray-400">
          <DollarSign className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum boleto encontrado</h3>
          <p className="text-gray-500">Você ainda não possui boletos cadastrados.</p>
        </CardContent>
      </Card>
    </div>
  );

  const ListaConfiguracoes = () => (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Configurações</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-4">Gerencie suas preferências e configurações do sistema.</p>
      <Card>
        <CardContent className="py-12 text-center text-gray-400">
          <Settings className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhuma configuração personalizada</h3>
          <p className="text-gray-500">Personalize o sistema conforme suas necessidades.</p>
        </CardContent>
      </Card>
    </div>
  );

  // Componente da Sidebar
  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      {/* Logo & Toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {sidebarOpen && (
          <a href="/" className="flex items-center">
            <img
              src="https://sistema.klrentacar.com.br/logo/logo-branco-new-semfundo.png"
              alt="KL Rent a Car"
              className="h-8 w-auto brightness-0"
            />
          </a>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        )}
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {(user?.nome || user?.nome_cli) ? (user.nome || user.nome_cli).charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {(() => {
                  const fullName = (user?.nome || user?.nome_cli || 'Usuário').trim();
                  const parts = fullName.split(' ');
                  if (parts.length === 1) return parts[0];
                  return `${parts[0]} ${parts[parts.length - 1]}`;
                })()}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id);
                onItemClick?.();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors shadow-sm
                ${isActive ? "bg-emerald-500 text-white shadow-md" : "text-gray-700 hover:bg-emerald-50"}
                ${!sidebarOpen && "justify-center"}`}
              style={{ fontWeight: isActive ? 600 : 500, letterSpacing: 0.2 }}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-emerald-600"}`} />
              {sidebarOpen && (
                <span className="text-sm font-medium tracking-wide">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Buttons */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button
          variant="outline"
          className={`w-full ${!sidebarOpen && "px-2"}`}
          onClick={() => {
            window.location.href = '/';
            onItemClick?.();
          }}
        >
          <LayoutDashboard className="w-5 h-5" />
          {sidebarOpen && <span className="ml-3">Voltar ao Site</span>}
        </Button>
        <Button
          variant="ghost"
          className={`w-full ${!sidebarOpen && "px-2"}`}
          onClick={() => {
            handleLogout();
            onItemClick?.();
          }}
        >
          <LogOut className="w-5 h-5" />
          {sidebarOpen && <span className="ml-3">Sair</span>}
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-full z-20`}
        >
          <SidebarContent />
        </aside>
      )}

      {/* Mobile Sidebar (Sheet) */}
      {isMobile && (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-[85vw] sm:w-[300px] bg-white p-0">
            <div className="flex flex-col h-full">
              <SidebarContent onItemClick={() => setMobileMenuOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 ${
          !isMobile ? (sidebarOpen ? "ml-64" : "ml-20") : ""
        } transition-all duration-300`}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 md:px-6">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <h1 className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-gray-900">
              Dashboard
            </h1>
          </div>
          
          {/* User Info & Logout */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {(user?.nome || user?.nome_cli) ? (user.nome || user.nome_cli).charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">
                  {(user?.nome || user?.nome_cli) || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500">{user?.email || ''}</p>
              </div>
            </div>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          {activeMenu === "dashboard" && (
            // Conteúdo do Dashboard original
            <>
              {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="hover-lift">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span className="hidden sm:inline">{stat.change} vs mês anterior</span>
                      <span className="sm:hidden">{stat.change}</span>
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Receita Mensal</CardTitle>
                <CardDescription>
                  Comparativo dos últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Gráfico de receita será exibido aqui
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reservations Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Reservas por Categoria</CardTitle>
                <CardDescription>
                  Distribuição dos veículos mais reservados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Gráfico de reservas será exibido aqui
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>
                Últimas movimentações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.client} - {activity.vehicle}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
            </>
          )}
          {activeMenu === "frota" && <ListaLocacao />}
          {activeMenu === "reservas" && <ListaReservas reservas={reservas} loadingReservas={loadingReservas} />}
          {activeMenu === "manutencao" && <ListaManutencao />}
          {activeMenu === "veiculos" && <ListaDocVeiculos />}
          {activeMenu === "boletos" && <ListaBoletos />}
          {activeMenu === "configuracoes" && <ListaConfiguracoes />}
        </div>
      </main>
    </div>
  );
};

export default Painel;
