
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PaymentSummary from '@/components/vendas/PaymentSummary';
import PaymentMethodSelector from '@/components/vendas/PaymentMethodSelector';

interface FormaPagamento {
  id: string;
  nome: string;
  selecionada: boolean;
  valor: number;
  valorTexto: string;
  editando: boolean;
}

interface FinalizarVendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (formasPagamento: { nome: string; valor: number }[]) => void;
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
    const formasSelecionadas = formasPagamento
      .filter(forma => forma.selecionada && forma.valor > 0)
      .map(forma => ({ nome: forma.nome, valor: forma.valor }));
    
    onConfirm(formasSelecionadas);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Finalizar Venda</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Total da Venda</h3>
            <div className="text-3xl font-bold">R$ {subtotal.toFixed(2)}</div>
          </div>

          <PaymentSummary 
            subtotal={subtotal}
            totalInformado={totalInformado}
            faltam={faltam}
          />

          <PaymentMethodSelector
            formasPagamento={formasPagamento}
            onCheckboxChange={handleCheckboxChange}
            onValorChange={handleValorChange}
            onValorFocus={handleValorFocus}
            onValorBlur={handleValorBlur}
          />

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
