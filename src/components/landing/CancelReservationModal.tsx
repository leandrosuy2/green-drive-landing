import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { AlertTriangle } from "lucide-react";

interface CancelReservationModalProps {
  open: boolean;
  onClose: () => void;
  onCancel: (motivo: string) => void;
  loading?: boolean;
}

export const CancelReservationModal: React.FC<CancelReservationModalProps> = ({
  open,
  onClose,
  onCancel,
  loading = false,
}) => {
  const [motivo, setMotivo] = useState("");

  const handleCancel = () => {
    onCancel(motivo);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-8 rounded-2xl shadow-2xl border-0 bg-white dark:bg-zinc-900">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-2">
            <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-300" />
          </span>
          <DialogTitle className="text-2xl font-bold text-red-600 dark:text-red-300 mb-1">Cancelar Reserva</DialogTitle>
          <p className="mb-2 text-gray-600 dark:text-gray-300 text-base">Tem certeza que deseja cancelar esta reserva? Por favor, informe o motivo do cancelamento abaixo.</p>
          <Textarea
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            placeholder="Ex: Cliente desistiu"
            className="mb-4 min-h-[80px] bg-zinc-50 dark:bg-zinc-800 border-2 border-red-200 dark:border-red-700 focus-visible:ring-red-500"
            disabled={loading}
            maxLength={200}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading} className="min-w-[100px]">
            Voltar
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loading}
            className="min-w-[160px] font-bold text-base"
            {...(loading ? { children: "Cancelando..." } : {})}
          >
            {loading ? "Cancelando..." : "Cancelar Reserva"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
