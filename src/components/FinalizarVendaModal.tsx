
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface FormaPagamento {
  id: string;
  nome: string;
  selecionada: boolean;
  valor: number;
}

interface FinalizarVendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subtotal: number;
}

const FinalizarVendaModal: React.FC<FinalizarVendaModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  subtotal
}) => {
  const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>([
    { id: 'dinheiro', nome: 'Dinheiro', selecionada: true, valor: subtotal },
    { id: 'cartao-credito', nome: 'Cartão de Crédito', selecionada: true, valor: subtotal },
    { id: 'cartao-debito', nome: 'Cartão de Débito', selecionada: false, valor: 0 },
    { id: 'pix', nome: 'PIX', selecionada: false, valor: 0 }
  ]);

  const totalInformado = formasPagamento.reduce((acc, forma) => 
    forma.selecionada ? acc + forma.valor : acc, 0
  );

  const troco = totalInformado - subtotal;

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormasPagamento(prev => prev.map(forma => 
      forma.id === id 
        ? { ...forma, selecionada: checked, valor: checked ? subtotal : 0 }
        : forma
    ));
  };

  const handleValorChange = (id: string, valor: string) => {
    const numericValue = parseFloat(valor) || 0;
    setFormasPagamento(prev => prev.map(forma => 
      forma.id === id ? { ...forma, valor: numericValue } : forma
    ));
  };

  const handleFinalizar = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Finalizar Venda</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Total da Venda</h3>
            <div className="text-3xl font-bold">R$ {subtotal.toFixed(2)}</div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total da Venda:</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Informado:</span>
              <span>R$ {totalInformado.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Troco:</span>
              <span>R$ {troco.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-yellow-50 p-3 rounded">
            <p className="text-sm text-gray-700 mb-3">
              Selecione as formas de pagamento e os valores correspondentes:
            </p>
            
            <div className="space-y-3">
              {formasPagamento.map((forma) => (
                <div key={forma.id} className="flex items-center gap-3">
                  <Checkbox
                    id={forma.id}
                    checked={forma.selecionada}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(forma.id, checked as boolean)
                    }
                  />
                  <label htmlFor={forma.id} className="flex-1 text-sm">
                    {forma.nome}
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={forma.valor.toFixed(2)}
                    onChange={(e) => handleValorChange(forma.id, e.target.value)}
                    disabled={!forma.selecionada}
                    className="w-24 text-right"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleFinalizar}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              Finalizar Pagamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FinalizarVendaModal;
