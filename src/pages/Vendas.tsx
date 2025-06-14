import { useState } from "react";
import { ShoppingCart, Plus, Search, User, Trash2, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import FinalizarVendaModal from "@/components/FinalizarVendaModal";

interface Produto {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  estoque: number;
  preco: number;
  imagem: string;
}

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
  total: number;
}

const Vendas = () => {
  const [produtos] = useState<Produto[]>([
    {
      id: 1,
      codigo: "PLT001",
      nome: "ROSA VERMELHA",
      categoria: "Flores",
      estoque: 25,
      preco: 15.90,
      imagem: "/lovable-uploads/f3ca6925-b6cb-459b-9eaa-422549153b2b.png"
    },
    {
      id: 2,
      codigo: "PLT002", 
      nome: "SAMAMBAIA",
      categoria: "Folhagem",
      estoque: 8,
      preco: 25.00,
      imagem: "/lovable-uploads/4b16ca18-e502-4020-96ef-096f7dbea63d.png"
    },
    {
      id: 3,
      codigo: "PLT003",
      nome: "SUCULENTA ECHEVERIA",
      categoria: "Suculentas",
      estoque: 45,
      preco: 12.50,
      imagem: "/lovable-uploads/76b52c52-e6fb-4664-beb4-5dfa62c8869d.png"
    },
    {
      id: 4,
      codigo: "PLT004",
      nome: "ORQUÍDEA PHALAENOPSIS",
      categoria: "Flores",
      estoque: 5,
      preco: 85.00,
      imagem: "/lovable-uploads/56fd79a4-cedc-4c8d-a9fe-624dffa1d655.png"
    }
  ]);

  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [clienteSearch, setClienteSearch] = useState("");
  const [produtoSearch, setProdutoSearch] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(produtos[0]);
  const { toast } = useToast();
  const [isFinalizarModalOpen, setIsFinalizarModalOpen] = useState(false);

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

    setIsFinalizarModalOpen(true);
  };

  const confirmarFinalizacao = () => {
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

              {/* Produto Selecionado */}
              {produtoSelecionado && (
                <div className="text-center py-8">
                  <h3 className="text-lg font-bold mb-2">{produtoSelecionado.nome}</h3>
                  <div className="text-2xl font-bold text-orange-500 mb-4">
                    R$ {produtoSelecionado.preco.toFixed(2)}
                  </div>
                  <div className="w-48 h-48 mx-auto mb-4 border-4 border-orange-500 rounded-lg overflow-hidden bg-white">
                    <img 
                      src={produtoSelecionado.imagem} 
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

              {/* Total de Itens */}
              <div className="text-sm text-gray-600">
                Total de Itens: {totalItens}
              </div>

              {/* Subtotal */}
              <div className="text-right text-sm">
                Subtotal: <span className="font-bold">R$ {subtotal.toFixed(2)}</span>
              </div>

              {/* Botões */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={limparCarrinho}
                >
                  Limpar Carrinho
                </Button>
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
                  R$ {subtotal.toFixed(2)}
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
                        {produtosFiltrados.map((produto) => (
                          <TableRow 
                            key={produto.id} 
                            className={`hover:bg-gray-50 cursor-pointer ${
                              produtoSelecionado?.id === produto.id ? 'bg-orange-50' : ''
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
                                className="bg-orange-500 hover:bg-orange-600 text-white w-8 h-8 p-0"
                                disabled={produto.estoque === 0}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
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
        </div>
      </div>

      <FinalizarVendaModal
        isOpen={isFinalizarModalOpen}
        onClose={() => setIsFinalizarModalOpen(false)}
        onConfirm={confirmarFinalizacao}
        subtotal={subtotal}
      />
    </div>
  );
};

export default Vendas;
