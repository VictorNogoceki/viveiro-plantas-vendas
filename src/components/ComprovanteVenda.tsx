
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { ItemCarrinho } from '@/types/carrinho';

interface ComprovanteVendaProps {
  isOpen: boolean;
  onClose: () => void;
  carrinho: ItemCarrinho[];
  subtotal: number;
  formasPagamento: { nome: string; valor: number }[];
  vendaId: string;
}

const ComprovanteVenda: React.FC<ComprovanteVendaProps> = ({
  isOpen,
  onClose,
  carrinho,
  subtotal,
  formasPagamento,
  vendaId
}) => {
  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR');
  const horaFormatada = dataAtual.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handleImprimir = () => {
    console.log("Iniciando impressão do comprovante");
    window.print();
  };

  const handleClose = () => {
    console.log("Fechando comprovante");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md print:max-w-none print:w-auto print:h-auto print:shadow-none print:border-none print:bg-white">
        <DialogHeader className="print:hidden">
          <DialogTitle>Comprovante de Venda</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-sm print:space-y-2">
          {/* Cabeçalho da empresa */}
          <div className="text-center space-y-1 print:space-y-0">
            <h3 className="font-bold text-lg print:text-base">VIVEIRO EBENEZER</h3>
            <p className="print:text-xs">Av: Perimetral Presidente Tancredo de Almeida Neves, 100</p>
            <p className="print:text-xs">CNPJ: 25.402.183/0001-00</p>
            <p className="print:text-xs">TEL: (44) 99926-0736</p>
          </div>

          <hr className="border-gray-300 print:border-black" />

          {/* Informações da venda */}
          <div className="space-y-1 print:space-y-0">
            <p className="print:text-xs">Data: {dataFormatada} {horaFormatada}</p>
            <p className="print:text-xs">Venda #: {vendaId}</p>
          </div>

          <hr className="border-gray-300 print:border-black" />

          {/* Cabeçalho da tabela */}
          <div className="grid grid-cols-4 gap-2 font-semibold print:text-xs">
            <span>Produto</span>
            <span className="text-center">Qtd</span>
            <span className="text-right">Valor</span>
            <span className="text-right">Total</span>
          </div>

          {/* Produtos */}
          <div className="space-y-1 print:space-y-0">
            {carrinho.map((item) => (
              <div key={item.produto.id} className="grid grid-cols-4 gap-2 print:text-xs">
                <span className="text-xs truncate print:text-xs">{item.produto.nome}</span>
                <span className="text-center">{item.quantidade}</span>
                <span className="text-right">R$ {item.produto.preco.toFixed(2)}</span>
                <span className="text-right">R$ {item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <hr className="border-gray-300 print:border-black" />

          {/* Total */}
          <div className="flex justify-between font-bold print:text-xs">
            <span>Total:</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>

          <hr className="border-gray-300 print:border-black" />

          {/* Forma de pagamento */}
          <div className="space-y-1 print:space-y-0">
            <p className="font-semibold print:text-xs">Forma de Pagamento:</p>
            {formasPagamento.map((forma, index) => (
              <p key={index} className="print:text-xs">{forma.nome}: R$ {forma.valor.toFixed(2)}</p>
            ))}
          </div>

          <hr className="border-gray-300 print:border-black" />

          {/* Mensagem de agradecimento */}
          <div className="text-center print:text-xs">
            <p className="font-medium">Obrigado pela preferência!</p>
          </div>

          {/* Botões de ação - completamente ocultos na impressão */}
          <div className="flex gap-2 pt-4 print:hidden">
            <Button 
              onClick={handleImprimir}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir / Baixar
            </Button>
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComprovanteVenda;
