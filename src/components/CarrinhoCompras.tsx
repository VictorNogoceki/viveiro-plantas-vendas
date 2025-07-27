
import React from 'react';
import { ShoppingCart, User, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Produto } from '@/types/produto';
import { ItemCarrinho } from '@/types/carrinho';
import { formatCurrency } from '@/lib/utils';

interface CarrinhoComprasProps {
  carrinho: ItemCarrinho[];
  clienteSearch: string;
  setClienteSearch: (value: string) => void;
  produtoSelecionado: Produto | null;
  atualizarQuantidade: (produtoId: string, novaQuantidade: number) => void;
  removerDoCarrinho: (produtoId: string) => void;
  limparCarrinho: () => void;
  finalizarVenda: () => void;
  subtotal: number;
  totalItens: number;
}

const CarrinhoCompras: React.FC<CarrinhoComprasProps> = ({
  carrinho,
  clienteSearch,
  setClienteSearch,
  produtoSelecionado,
  atualizarQuantidade,
  removerDoCarrinho,
  limparCarrinho,
  finalizarVenda,
  subtotal,
  totalItens
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Carrinho de Compras
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Busca Cliente */}
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="BUSCAR CLIENTE POR NOME OU CPF/CNPJ"
            value={clienteSearch}
            onChange={(e) => setClienteSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Produto Selecionado */}
        {produtoSelecionado && (
          <div className="text-center py-8">
            <h3 className="text-lg font-bold mb-2">{produtoSelecionado.nome}</h3>
            <div className="text-2xl font-bold text-orange-500 mb-4">
              {formatCurrency(produtoSelecionado.preco)}
            </div>
            <div className="w-48 h-48 mx-auto mb-4 border-4 border-orange-500 rounded-lg overflow-hidden bg-white">
              <img 
                src={produtoSelecionado.imagem || '/placeholder.svg'} 
                alt={produtoSelecionado.nome}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Tabela do Carrinho */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Produto</TableHead>
                <TableHead>Qtd</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carrinho.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    Item não encontrado
                  </TableCell>
                </TableRow>
              ) : (
                carrinho.map((item) => (
                  <TableRow key={item.produto.id}>
                    <TableCell className="font-medium">{item.produto.nome}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => atualizarQuantidade(item.produto.id, item.quantidade - 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantidade}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => atualizarQuantidade(item.produto.id, item.quantidade + 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(item.produto.preco)}</TableCell>
                    <TableCell>{formatCurrency(item.total)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removerDoCarrinho(item.produto.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Total de Itens */}
        <div className="text-sm text-gray-600">
          Total de Itens: {totalItens}
        </div>

        {/* Subtotal */}
        <div className="text-right text-sm">
          Subtotal: <span className="font-bold">{formatCurrency(subtotal)}</span>
        </div>

        {/* Botões */}
        <div className="flex gap-2">
          {carrinho.length > 0 && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={limparCarrinho}
            >
              Limpar Carrinho
            </Button>
          )}
          <Button 
            className="flex-1 bg-orange-500 hover:bg-orange-600"
            onClick={finalizarVenda}
          >
            Finalizar Venda
          </Button>
        </div>

        {/* Total Final */}
        <div className="text-center pt-4 border-t">
          <div className="text-lg font-bold text-gray-900">
            Total
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(subtotal)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarrinhoCompras;
