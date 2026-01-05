import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import ForgotPasswordModal from "./ForgotPasswordModal";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}

const LoginModal = ({ isOpen, onClose, onSwitchToRegister, onSwitchToForgotPassword }: LoginModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const senha = formData.get('password') as string;

    try {
      const response = await authService.login({ email, senha });
      
      setIsLoading(false);
      
      toast({
        title: "Login realizado com sucesso! ✅",
        description: `Bem-vindo de volta${response.user?.nome ? ', ' + response.user.nome.split(' ')[0] : ''}!`,
      });
      
      // Fecha o modal após 2 segundos do toast aparecer
      setTimeout(() => {
        onClose();
        // Dispara evento customizado para atualizar o TopNav
        window.dispatchEvent(new Event('storage'));
        // Recarrega para atualizar estado
        window.location.reload();
      }, 2000);
      
      return; // Importante: sai da função após sucesso
    } catch (error: any) {
      // Em caso de erro, apenas mostra o toast e mantém loading false
      setIsLoading(false);
      
      toast({
        title: "Erro ao fazer login ❌",
        description: error.message || "E-mail ou senha incorretos.",
        variant: "destructive",
      });
      
      // NÃO faz mais nada - a modal permanece aberta automaticamente
      return;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Bem-vindo de volta!</DialogTitle>
          <DialogDescription className="text-center">
            Acesse sua conta para continuar
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="login-email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="login-email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                className="pl-10"
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="text-right">
              <button
                type="button"
                onClick={onSwitchToForgotPassword}
                className="text-xs text-primary hover:underline font-medium"
              >
                Esqueceu a senha?
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Ainda não tem uma conta?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary font-semibold hover:underline"
            >
              Cadastre-se agora
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
