import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  { label: "LOCAÇÃO", icon: Car, href: "/frota" },
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
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [user, setUser] = useState<{ id: number; nome?: string; nome_cli?: string; email: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenLogin = () => {
    setIsRegisterOpen(false);
    setIsForgotPasswordOpen(false);
    setIsLoginOpen(true);
  };

  const handleOpenRegister = () => {
    // Redirecionar para página de cadastro ao invés de abrir modal
    navigate("/cadastro");
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
    const isInternalRoute = item.href.startsWith('/');
    
    if (isInternalRoute) {
      return (
        <button
          key={item.href}
          onClick={() => {
            navigate(item.href);
            if (onClick) onClick();
          }}
          className="group flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-lg transition-all hover:bg-emerald-50 active:scale-95 w-full text-left"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
            <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-emerald-900 font-bold text-sm tracking-wide">
            {item.label}
          </span>
        </button>
      );
    }
    
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
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 shadow-lg",
        isScrolled 
          ? "bg-white backdrop-blur-sm" 
          : "bg-gradient-to-r from-emerald-600 to-emerald-700",
        className
      )}>
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
          <nav className="flex items-center justify-between py-2 md:py-3">
            {/* Logo */}
            <div className="flex items-center mr-2 sm:mr-4 flex-shrink-0">
              <a href="/" className="flex items-center">
                <img 
                  src="https://sistema.klrentacar.com.br/logo/logo-branco-new-semfundo.png" 
                  alt="KL Rent a Car" 
                  className="h-8 sm:h-10 md:h-12 object-contain cursor-pointer hover:opacity-90 transition-all duration-300"
                  style={{ filter: isScrolled ? 'brightness(0) invert(0)' : 'brightness(0)' }}
                />
              </a>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1 flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isInternalRoute = item.href.startsWith('/');
                
                if (isInternalRoute) {
                  return (
                    <button
                      key={item.href}
                      onClick={() => navigate(item.href)}
                      className={cn(
                        "group flex items-center gap-1 whitespace-nowrap px-2 py-1 rounded-md transition-all active:scale-95",
                        isScrolled 
                          ? "hover:bg-emerald-50" 
                          : "hover:bg-white/10"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-4 h-4 rounded-full shadow-sm group-hover:scale-110 transition-transform flex-shrink-0",
                        isScrolled 
                          ? "bg-emerald-600" 
                          : "bg-white"
                      )}>
                        <Icon className={cn(
                          "w-2.5 h-2.5",
                          isScrolled ? "text-white" : "text-emerald-600"
                        )} strokeWidth={2.5} />
                      </div>
                      <span className={cn(
                        "font-medium text-[11px] xl:text-xs tracking-wide transition-colors",
                        isScrolled ? "text-emerald-900" : "text-white"
                      )}>
                        {item.label}
                      </span>
                    </button>
                  );
                }
                
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                    className={cn(
                      "group flex items-center gap-1 whitespace-nowrap px-2 py-1 rounded-md transition-all active:scale-95",
                      isScrolled 
                        ? "hover:bg-emerald-50" 
                        : "hover:bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-4 h-4 rounded-full shadow-sm group-hover:scale-110 transition-transform flex-shrink-0",
                      isScrolled 
                        ? "bg-emerald-600" 
                        : "bg-white"
                    )}>
                      <Icon className={cn(
                        "w-2.5 h-2.5",
                        isScrolled ? "text-white" : "text-emerald-600"
                      )} strokeWidth={2.5} />
                    </div>
                    <span className={cn(
                      "font-medium text-[11px] xl:text-xs tracking-wide transition-colors",
                      isScrolled ? "text-emerald-900" : "text-white"
                    )}>
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
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full transition-all active:scale-95",
                      isScrolled 
                        ? "bg-emerald-600 hover:bg-emerald-700" 
                        : "bg-white/10 hover:bg-white/20"
                    )}
                    aria-label="Abrir menu"
                  >
                    <Menu className={cn(
                      "w-6 h-6 transition-colors",
                      isScrolled ? "text-white" : "text-white"
                    )} strokeWidth={2.5} />
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
                  <div className={cn(
                    "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors",
                    isScrolled 
                      ? "bg-emerald-50" 
                      : "bg-white/10"
                  )}>
                    <div className={cn(
                      "flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs transition-colors",
                      isScrolled 
                        ? "bg-emerald-600 text-white" 
                        : "bg-white text-emerald-600"
                    )}>
                      {(user?.nome || user?.nome_cli) ? (user.nome || user.nome_cli).charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className={cn(
                      "font-medium text-sm transition-colors",
                      isScrolled ? "text-emerald-900" : "text-white"
                    )}>
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
                    className={cn(
                      "flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all active:scale-95 whitespace-nowrap",
                      isScrolled 
                        ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                        : "bg-white text-emerald-600 hover:bg-emerald-50"
                    )}
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
                    className={cn(
                      "flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all active:scale-95 whitespace-nowrap",
                      isScrolled 
                        ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                        : "bg-white text-emerald-600 hover:bg-emerald-50"
                    )}
                  >
                    <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                    <span className="hidden sm:inline">Cadastrar</span>
                  </button>
                  <button
                    onClick={handleOpenLogin}
                    className={cn(
                      "flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all active:scale-95 whitespace-nowrap",
                      isScrolled 
                        ? "bg-emerald-800 text-white hover:bg-emerald-900" 
                        : "bg-emerald-800 text-white hover:bg-emerald-900"
                    )}
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
