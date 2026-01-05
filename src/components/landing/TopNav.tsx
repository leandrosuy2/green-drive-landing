import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  Car, 
  User, 
  CarFront, 
  Zap, 
  Handshake, 
  Shield, 
  AlertTriangle, 
  Scale,
  LogIn,
  UserPlus,
  LogOut,
  Menu
} from "lucide-react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { authService } from "@/services/authService";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { label: "LOCAÇÃO", icon: Car, href: "#locacao" },
  { label: "PESSOA FÍSICA", icon: User, href: "#pessoa-fisica" },
  { label: "SEMINOVOS", icon: CarFront, href: "#seminovos" },
  { label: "FREEDOM", icon: Zap, href: "http://klfreedom.com.br/", external: true },
  { label: "PARCEIRO BESTCAR", icon: Handshake, href: "https://bestcar.com.br/", external: true },
  { label: "INTEGRIDADE", icon: Shield, href: "#integridade" },
  { label: "DENÚNCIA", icon: AlertTriangle, href: "#denuncia" },
  { label: "IGUALDADE SALARIAL", icon: Scale, href: "#igualdade-salarial" },
];

interface TopNavProps {
  className?: string;
}

const TopNav = ({ className }: TopNavProps) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [user, setUser] = useState<{ id: number; nome: string; email: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Verificar se há usuário logado
    const loggedUser = authService.getUser();
    setUser(loggedUser);

    // Listener para mudanças no localStorage
    const handleStorageChange = () => {
      const loggedUser = authService.getUser();
      setUser(loggedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleOpenLogin = () => {
    setIsRegisterOpen(false);
    setIsForgotPasswordOpen(false);
    setIsLoginOpen(true);
  };

  const handleOpenRegister = () => {
    setIsLoginOpen(false);
    setIsForgotPasswordOpen(false);
    setIsRegisterOpen(true);
  };

  const handleOpenForgotPassword = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsForgotPasswordOpen(true);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const renderNavItem = (item: typeof navItems[0], onClick?: () => void) => {
    const Icon = item.icon;
    return (
      <a
        key={item.href}
        href={item.href}
        {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
        onClick={onClick}
        className="group flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-lg transition-all hover:bg-emerald-50 active:scale-95"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
          <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-emerald-900 font-bold text-sm tracking-wide">
          {item.label}
        </span>
      </a>
    );
  };

  return (
    <>
      <div className={cn("fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg", className)}>
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
          <nav className="flex items-center justify-between py-1.5 md:py-2">
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center justify-center flex-wrap gap-2 md:gap-3 lg:gap-4 xl:gap-6 flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="group flex items-center gap-1.5 sm:gap-2 whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition-all hover:bg-white/10 active:scale-95"
                  >
                    <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                      <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-emerald-600" strokeWidth={2.5} />
                    </div>
                    <span className="text-white font-bold text-[10px] sm:text-xs md:text-sm tracking-wide">
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-95"
                    aria-label="Abrir menu"
                  >
                    <Menu className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] sm:w-[400px] bg-white p-0">
                  <div className="flex flex-col h-full">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
                      <h2 className="text-white font-bold text-lg">Menu</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                      {navItems.map((item) => renderNavItem(item, () => setIsMobileMenuOpen(false)))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Auth Buttons / User Area */}
            <div className="flex items-center gap-1.5 sm:gap-2 ml-2 sm:ml-4">
              {user ? (
                // Usuário logado
                <>
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-emerald-600 font-bold text-xs">
                      {(user?.nome || user?.nome_cli) ? (user.nome || user.nome_cli).charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-white font-medium text-sm">
                      {(() => {
                        const fullName = (user?.nome || user?.nome_cli || 'Usuário').trim();
                        const parts = fullName.split(' ');
                        if (parts.length === 1) return parts[0];
                        return `${parts[0]} ${parts[parts.length - 1]}`;
                      })()}
                    </span>
                  </div>
                  <button
                    onClick={() => window.location.href = '/painel'}
                    className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-white text-emerald-600 rounded-full font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-all active:scale-95 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Painel</span>
                    <span className="sm:hidden">P</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-red-500 text-white rounded-full font-bold text-xs sm:text-sm hover:bg-red-600 transition-all active:scale-95 whitespace-nowrap"
                  >
                    <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5} />
                    <span className="hidden sm:inline">Sair</span>
                  </button>
                </>
              ) : (
                // Usuário não logado
                <>
                  <button
                    onClick={handleOpenRegister}
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 bg-white text-emerald-600 rounded-full font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-all active:scale-95 whitespace-nowrap"
                  >
                    <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                    <span className="hidden sm:inline">Cadastrar</span>
                  </button>
                  <button
                    onClick={handleOpenLogin}
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 bg-emerald-800 text-white rounded-full font-bold text-xs sm:text-sm hover:bg-emerald-900 transition-all active:scale-95 whitespace-nowrap"
                  >
                    <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                    <span className="hidden sm:inline">Logar</span>
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>

    {/* Auth Modals */}
    <LoginModal
      isOpen={isLoginOpen}
      onClose={() => setIsLoginOpen(false)}
      onSwitchToRegister={handleOpenRegister}
      onSwitchToForgotPassword={handleOpenForgotPassword}
    />
    <RegisterModal
      isOpen={isRegisterOpen}
      onClose={() => setIsRegisterOpen(false)}
      onSwitchToLogin={handleOpenLogin}
    />
    <ForgotPasswordModal
      isOpen={isForgotPasswordOpen}
      onClose={() => setIsForgotPasswordOpen(false)}
    />
  </>
  );
};

export default TopNav;
