import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authService } from "@/services/authService";
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
  Activity
} from "lucide-react";

const Painel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [user, setUser] = useState(authService.getUser());

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

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "frota", label: "Frota", icon: Car },
    { id: "reservas", label: "Reservas", icon: Calendar },
    { id: "clientes", label: "Clientes", icon: Users },
    { id: "relatorios", label: "Relatórios", icon: FileText },
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-full z-20`}
      >
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.nome || 'Usuário'}
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
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:bg-gray-100"
                } ${!sidebarOpen && "justify-center"}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
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
            onClick={() => window.location.href = '/'}
          >
            <LayoutDashboard className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3">Voltar ao Site</span>}
          </Button>
          <Button
            variant="ghost"
            className={`w-full ${!sidebarOpen && "px-2"}`}
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3">Sair</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 ${
          sidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Dashboard
          </h1>
          
          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.nome || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500">{user?.email || ''}</p>
              </div>
            </div>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="hover-lift">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change} vs mês anterior
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </div>
      </main>
    </div>
  );
};

export default Painel;
