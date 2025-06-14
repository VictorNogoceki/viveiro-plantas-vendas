
import { useState } from "react";
import { ShoppingCart, Plus, Search, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Produto {
  id: number;
  codigo: string;
  nome: string;
  preco: number;
}

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
  total: number;
}

const Vendas = () => {
  const [produtos] = useState<Produto[]>([
    { id: 1, codigo: "50", nome: "AÇUCAR", preco: 25.90 },
    { id: 2, codigo: "10", nome: "ARROZ 5KG TIO JOÃO", preco: 39.90 },
    { id: 3, codigo: "1002", nome: "CAFÉ PILÃO", preco: 29.00 },
    { id: 4, codigo: "142", nome: "ÓLEO DE SOJA LIZA PET 900ML", preco: 8.90 }
  ]);

  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [clienteSearch, setClienteSearch] = useState("");
  const [produtoSearch, setProdutoSearch] = useState("");
  const { toast } = useToast();

  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(produtoSearch.toLowerCase()) ||
    produto.codigo.includes(produtoSearch)
  );

  const adicionarAoCarrinho = (produto: Produto) => {
    const itemExistente = carrinho.find(item => item.produto.id === produto.id);
    
    if (itemExistente) {
      setCarrinho(carrinho.map(item =>
        item.produto.id === produto.id
          ? { ...item, quantidade: item.quantidade + 1, total: (item.quantidade + 1) * produto.preco }
          : item
      ));
    } else {
      setCarrinho([...carrinho, {
        produto,
        quantidade: 1,
        total: produto.preco
      }]);
    }

    toast({
      title: "Produto Adicionado",
      description: `${produto.nome} foi adicionado ao carrinho`,
    });
  };

  const removerDoCarrinho = (produtoId: number) => {
    setCarrinho(carrinho.filter(item => item.produto.id !== produtoId));
  };

  const atualizarQuantidade = (produtoId: number, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(produtoId);
      return;
    }

    setCarrinho(carrinho.map(item =>
      item.produto.id === produtoId
        ? { ...item, quantidade: novaQuantidade, total: novaQuantidade * item.produto.preco }
        : item
    ));
  };

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  const finalizarVenda = () => {
    if (carrinho.length === 0) {
      toast({
        title: "Carrinho Vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a venda",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Venda Finalizada",
      description: `Venda realizada com sucesso! Total: R$ ${subtotal.toFixed(2)}`,
    });
    
    setCarrinho([]);
    setClienteSearch("");
  };

  const subtotal = carrinho.reduce((acc, item) => acc + item.total, 0);
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ponto de Venda (PDV)</h1>
            <p className="text-gray-600">Home / PDV</p>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-5 w-5" />
            <span>victor augusto</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Carrinho de Compras */}
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
                            <Input
                              type="number"
                              value={item.quantidade}
                              onChange={(e) => atualizarQuantidade(item.produto.id, parseInt(e.target.value) || 0)}
                              className="w-16 h-8"
                              min="0"
                            />
                          </TableCell>
                          <TableCell>R$ {item.produto.preco.toFixed(2)}</TableCell>
                          <TableCell>R$ {item.total.toFixed(2)}</TableCell>
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

              {/* Total */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total de Itens: {totalItens}</span>
                  <span>Subtotal: R$ {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={limparCarrinho}
                  >
                    Limpar Carrinho
                  </Button>
                  <Button 
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                    onClick={finalizarVenda}
                  >
                    Finalizar Venda
                  </Button>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    Total
                  </div>
                  <div className="text-4xl font-bold text-gray-900">
                    R$ {subtotal.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Adicione produtos ao carrinho
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Produtos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Produtos</span>
                <Button variant="outline" size="sm" className="gap-2">
                  <span className="text-orange-500">|||</span>
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
                  <TabsTrigger value="lista" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                    Lista de Produtos
                  </TabsTrigger>
                  <TabsTrigger value="populares">Populares</TabsTrigger>
                </TabsList>
                
                <TabsContent value="lista" className="mt-4">
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {produtosFiltrados.map((produto) => (
                      <div key={produto.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-sm text-gray-600">{produto.codigo}</span>
                            <span className="font-medium">{produto.nome}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">R$ {produto.preco.toFixed(2)}</span>
                          <Button
                            size="sm"
                            onClick={() => adicionarAoCarrinho(produto)}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
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
        </div>
      </div>
    </div>
  );
};

export default Vendas;
