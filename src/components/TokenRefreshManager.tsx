import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Hook para gerenciar a renovação do token com confirmação do usuário
 * Verifica a cada 3 minutos e pergunta se quer renovar
 */
export const TokenRefreshManager = () => {
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    // Verificar se há um usuário logado
    if (!authService.isAuthenticated()) {
      console.log('[TokenRefreshManager] Não autenticado ao montar.');
      return;
    }

    // Aguardar 5 segundos antes da primeira verificação
    const initialTimeout = setTimeout(() => {
      checkTokenExpiration();
    }, 5000);

    // Verificar token a cada 3 minutos
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 3 * 60 * 1000); // 3 minutos

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // Countdown quando o modal está aberto
  useEffect(() => {
    if (!showModal) return;

    setCountdown(30);
    
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Tempo esgotado, fazer logout
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [showModal]);

  const checkTokenExpiration = async () => {
    if (!authService.isAuthenticated()) {
      console.log('[TokenRefreshManager] Não autenticado ao checar expiração.');
      return;
    }

    try {
      // Tentar verificar o token
      await authService.me();
      console.log('[TokenRefreshManager] ✅ Token válido');
    } catch (error: any) {
      console.error('[TokenRefreshManager] ❌ Erro ao verificar token:', error);
      
      // Token expirado ou prestes a expirar
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        // Mostrar modal perguntando se quer renovar
        setShowModal(true);
        console.warn('[TokenRefreshManager] Token expirado ou inválido. Modal aberto para renovação.');
      }
    }
  };

  const handleRenewToken = async () => {
    try {
      await authService.me();
      
      toast({
        title: "Sessão renovada!",
        description: "Você pode continuar usando o sistema.",
      });
      
      setShowModal(false);
    } catch (error) {
      toast({
        title: "Erro ao renovar sessão",
        description: "Por favor, faça login novamente.",
        variant: "destructive",
      });
      
      handleLogout();
    }
  };

  const handleLogout = () => {
    setShowModal(false);
    toast({
      title: "Sessão encerrada",
      description: "Você foi desconectado.",
      variant: "destructive",
    });
    
    setTimeout(() => {
      authService.logout();
    }, 1000);
  };

  return (
    <AlertDialog open={showModal} onOpenChange={setShowModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sessão expirando</AlertDialogTitle>
          <AlertDialogDescription>
            Sua sessão está prestes a expirar. Deseja continuar conectado?
            <div className="mt-4 text-center">
              <span className="text-2xl font-bold text-primary">
                {countdown}s
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Você será desconectado automaticamente se não responder.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleLogout}>
            Sair
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleRenewToken}>
            Continuar Conectado
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
