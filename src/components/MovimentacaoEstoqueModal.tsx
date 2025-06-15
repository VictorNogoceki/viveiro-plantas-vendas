
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Produto } from "@/types/produto";
import { MovimentacaoEstoqueForm } from "@/components/estoque/MovimentacaoEstoqueForm";

interface MovimentacaoEstoqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  produto?: Produto;
  produtos: Produto[];
  onSave: (movimentacao: {
    produtoId: string;
    tipo: 'entrada' | 'saida';
    quantidade: number;
    descricao: string;
  }) => void;
}

const MovimentacaoEstoqueModal = ({ isOpen, onClose, produto, produtos, onSave }: MovimentacaoEstoqueModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Movimentação de Estoque
          </DialogTitle>
        </DialogHeader>

        <MovimentacaoEstoqueForm
          produto={produto}
          produtos={produtos}
          onSave={onSave}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MovimentacaoEstoqueModal;
