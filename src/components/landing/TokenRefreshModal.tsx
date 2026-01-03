import { RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TokenRefreshModalProps {
  isOpen: boolean;
  onRenew: () => void;
  onLogout: () => void;
  isLoading?: boolean;
}

const TokenRefreshModal = ({ isOpen, onRenew, onLogout, isLoading }: TokenRefreshModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 text-primary" />
            Sua sessão expirou
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            Por questões de segurança, sua sessão foi encerrada. Deseja continuar navegando de onde parou?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-4">
          <Button 
            onClick={onRenew} 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Renovando sessão...
              </>
            ) : (
              "Sim, continuar logado"
            )}
          </Button>
          
          <Button 
            onClick={onLogout} 
            variant="outline" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            Não, fazer logout
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          💡 Dica: Mantenha-se ativo para evitar que sua sessão expire novamente
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default TokenRefreshModal;
