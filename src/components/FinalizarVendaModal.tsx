
import React, { useState, useEffect } from 'react';
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
  valorTexto: string;
  editando: boolean; // Novo campo para controlar se está sendo editado
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
    { id: 'dinheiro', nome: 'Dinheiro', selecionada: true, valor: subtotal, valorTexto: subtotal.toFixed(2), editando: false },
    { id: 'cartao-credito', nome: 'Cartão de Crédito', selecionada: false, valor: 0, valorTexto: '0.00', editando: false },
    { id: 'cartao-debito', nome: 'Cartão de Débito', selecionada: false, valor: 0, valorTexto: '0.00', editando: false },
    { id: 'pix', nome: 'PIX', selecionada: false, valor: 0, valorTexto: '0.00', editando: false }
  ]);

  // Recalcula os valores quando o subtotal muda, mas apenas se não estiver editando
  useEffect(() => {
    setFormasPagamento(prev => {
      const selecionadas = prev.filter(forma => forma.selecionada);
      if (selecionadas.length === 1) {
        return prev.map(forma => {
          if (forma.selecionada && !forma.editando) {
            return { ...forma, valor: subtotal, valorTexto: subtotal.toFixed(2) };
          }
          return forma;
        });
      }
      return prev;
    });
  }, [subtotal]);

  const totalInformado = formasPagamento.reduce((acc, forma) => 
    forma.selecionada ? acc + forma.valor : acc, 0
  );

  const faltam = subtotal - totalInformado;

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormasPagamento(prev => {
      const updated = prev.map(forma => 
        forma.id === id 
          ? { ...forma, selecionada: checked, valor: 0, valorTexto: '0.00', editando: false }
          : forma
      );
      
      // Se apenas uma opção está selecionada, coloca o valor total nela
      const selecionadas = updated.filter(forma => forma.selecionada);
      if (selecionadas.length === 1) {
        return updated.map(forma => 
          forma.selecionada 
            ? { ...forma, valor: subtotal, valorTexto: subtotal.toFixed(2) }
            : forma
        );
      }
      
      return updated;
    });
  };

  const handleValorChange = (id: string, textoValor: string) => {
    // Permite edição livre do texto, marca como editando
    setFormasPagamento(prev => prev.map(forma => 
      forma.id === id 
        ? { ...forma, valorTexto: textoValor, editando: true }
        : forma
    ));
  };

  const handleValorFocus = (id: string) => {
    // Marca como editando quando foca no campo
    setFormasPagamento(prev => prev.map(forma => 
      forma.id === id 
        ? { ...forma, editando: true }
        : forma
    ));
  };

  const handleValorBlur = (id: string) => {
    // Converte o texto para número e formata quando sai do campo
    setFormasPagamento(prev => prev.map(forma => {
      if (forma.id === id) {
        // Se o campo estiver vazio, usa 0
        const textoLimpo = forma.valorTexto.trim();
        let valorNumerico = 0;
        
        if (textoLimpo !== '') {
          // Substitui vírgula por ponto e tenta converter
          const valorConvertido = parseFloat(textoLimpo.replace(',', '.'));
          if (!isNaN(valorConvertido) && valorConvertido >= 0) {
            valorNumerico = valorConvertido;
          }
        }
        
        return {
          ...forma,
          valor: valorNumerico,
          valorTexto: valorNumerico.toFixed(2),
          editando: false
        };
      }
      return forma;
    }));
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
              <span>Faltam:</span>
              <span>R$ {faltam.toFixed(2)}</span>
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
                    type="text"
                    value={forma.selecionada ? forma.valorTexto : '0.00'}
                    onChange={(e) => handleValorChange(forma.id, e.target.value)}
                    onFocus={(e) => {
                      handleValorFocus(forma.id);
                      e.target.select();
                    }}
                    onBlur={() => handleValorBlur(forma.id)}
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
