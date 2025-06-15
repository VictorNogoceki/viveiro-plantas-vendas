
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface ItemCarrinho {
  produto: {
    id: number;
    codigo: string;
    nome: string;
    categoria: string;
    estoque: number;
    preco: number;
    imagem: string;
  };
  quantidade: number;
  total: number;
}

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
    window.print();
  };

  const handleBaixar = () => {
    // Aqui você pode implementar a lógica para download do comprovante
    console.log('Baixar comprovante');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Comprovante de Venda</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          {/* Cabeçalho da empresa */}
          <div className="text-center space-y-1">
            <h3 className="font-bold text-lg">VIVEIRO EBENEZER</h3>
            <p>Av: Perimetral Presidente Tancredo de Almeida Neves, 100</p>
            <p>CNPJ: 25.402.183/0001-00</p>
            <p>TEL: (44) 99926-0736</p>
          </div>

          <hr className="border-gray-300" />

          {/* Informações da venda */}
          <div className="space-y-1">
            <p>Data: {dataFormatada} {horaFormatada}</p>
            <p>Venda #: {vendaId}</p>
          </div>

          <hr className="border-gray-300" />

          {/* Cabeçalho da tabela */}
          <div className="grid grid-cols-4 gap-2 font-semibold">
            <span>Produto</span>
            <span className="text-center">Qtd</span>
            <span className="text-right">Valor</span>
            <span className="text-right">Total</span>
          </div>

          {/* Produtos */}
          <div className="space-y-1">
            {carrinho.map((item) => (
              <div key={item.produto.id} className="grid grid-cols-4 gap-2">
                <span className="text-xs truncate">{item.produto.nome}</span>
                <span className="text-center">{item.quantidade}</span>
                <span className="text-right">R$ {item.produto.preco.toFixed(2)}</span>
                <span className="text-right">R$ {item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <hr className="border-gray-300" />

          {/* Total */}
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>

          <hr className="border-gray-300" />

          {/* Forma de pagamento */}
          <div className="space-y-1">
            <p className="font-semibold">Forma de Pagamento:</p>
            {formasPagamento.map((forma, index) => (
              <p key={index}>{forma.nome}: R$ {forma.valor.toFixed(2)}</p>
            ))}
          </div>

          <hr className="border-gray-300" />

          {/* Mensagem de agradecimento */}
          <div className="text-center">
            <p className="font-medium">Obrigado pela preferência!</p>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleImprimir}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir / Baixar
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComprovanteVenda;
