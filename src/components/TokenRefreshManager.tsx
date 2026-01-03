import { useEffect } from 'react';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para gerenciar a renovação automática do token
 * Verifica a cada 3 minutos e renova automaticamente se necessário
 */
export const TokenRefreshManager = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se há um usuário logado
    if (!authService.isAuthenticated()) {
      return;
    }

    // Aguardar 5 segundos antes da primeira verificação
    const initialTimeout = setTimeout(() => {
      checkAndRenewToken();
    }, 5000);

    // Verificar e renovar token a cada 3 minutos
    const interval = setInterval(() => {
      checkAndRenewToken();
    }, 3 * 60 * 1000); // 3 minutos

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const checkAndRenewToken = async () => {
    if (!authService.isAuthenticated()) {
      return;
    }

    try {
      // Tentar renovar o token automaticamente
      await authService.me();
      console.log('✅ Token renovado automaticamente');
    } catch (error: any) {
      // Token inválido ou expirado
      console.error('❌ Erro ao renovar token:', error);
      
      // Apenas fazer logout silencioso se for erro de autenticação
      if (error?.response?.status === 401) {
        toast({
          title: "Sessão expirada",
          description: "Por favor, faça login novamente.",
          variant: "destructive",
        });
        
        // Fazer logout e redirecionar
        setTimeout(() => {
          authService.logout();
          window.location.href = '/';
        }, 1000);
      } else {
        // Outros erros (rede, etc) - apenas logar
        console.warn('Erro temporário ao verificar token, tentando novamente depois');
      }
    }
  };

  return null;
};
