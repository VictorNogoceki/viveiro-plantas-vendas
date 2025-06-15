import React from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Produto } from '@/types/produto';
import { Skeleton } from './ui/skeleton';

interface SelecaoProdutosProps {
  produtos: Produto[];
  produtoSearch: string;
  setProdutoSearch: (value: string) => void;
  produtoSelecionado: Produto | null;
  setProdutoSelecionado: (produto: Produto) => void;
  adicionarAoCarrinho: (produto: Produto) => void;
  isLoading: boolean;
}

const SelecaoProdutos: React.FC<SelecaoProdutosProps> = ({
  produtos,
  produtoSearch,
  setProdutoSearch,
  produtoSelecionado,
  setProdutoSelecionado,
  adicionarAoCarrinho,
  isLoading
}) => {
  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(produtoSearch.toLowerCase()) ||
    produto.codigo.includes(produtoSearch)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Produtos</span>
          <Button variant="outline" size="sm" className="gap-2">
            <span className="text-viveiro-green">|||</span>
            Simular Leitor
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Busca Produto */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="BUSCAR PRODUTO POR NOME OU CÓDIGO"
            value={produtoSearch}
            onChange={(e) => setProdutoSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="lista" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lista" className="data-[state=active]:bg-viveiro-green data-[state=active]:text-white">
              Lista de Produtos
            </TabsTrigger>
            <TabsTrigger value="populares">Populares</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lista" className="mt-4">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Código</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Preço</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell colSpan={4}>
                                <Skeleton className="h-8 w-full" />
                            </TableCell>
                        </TableRow>
                    ))
                  ) : produtosFiltrados.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                            Nenhum produto encontrado.
                        </TableCell>
                    </TableRow>
                  ) : (
                    produtosFiltrados.map((produto) => (
                      <TableRow 
                        key={produto.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${
                        produtoSelecionado?.id === produto.id ? 'bg-viveiro-green/10' : ''
                      }`}
                      onClick={() => setProdutoSelecionado(produto)}
                    >
                      <TableCell className="font-mono text-sm">{produto.codigo}</TableCell>
                      <TableCell className="font-medium">{produto.nome}</TableCell>
                      <TableCell className="text-right font-bold">
                        R$ {produto.preco.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            adicionarAoCarrinho(produto);
                          }}
                          className="bg-viveiro-green hover:bg-viveiro-green/90 text-white w-8 h-8 p-0"
                          disabled={produto.estoque === 0}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="populares" className="mt-4">
            <div className="text-center text-gray-500 py-8">
              <p>Produtos populares serão exibidos aqui</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SelecaoProdutos;
