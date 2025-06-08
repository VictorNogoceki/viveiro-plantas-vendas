
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Plus, Leaf, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Cliente {
  id: number;
  nome: string;
  telefone: string;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

interface ItemVenda {
  produto: Produto;
  quantidade: number;
  subtotal: number;
}

interface Venda {
  id: number;
  cliente: Cliente;
  itens: ItemVenda[];
  total: number;
  data: string;
}

const Vendas = () => {
  // Dados mock - em uma aplicação real, viriam de uma API
  const [clientes] = useState<Cliente[]>([
    { id: 1, nome: "Maria Silva", telefone: "(11) 99999-9999" },
    { id: 2, nome: "João Santos", telefone: "(11) 88888-8888" }
  ]);

  const [produtos] = useState<Produto[]>([
    { id: 1, nome: "Rosa Vermelha", preco: 15.90, quantidade: 50 },
    { id: 2, nome: "Samambaia", preco: 25.00, quantidade: 30 },
    { id: 3, nome: "Violeta", preco: 8.50, quantidade: 25 }
  ]);

  const [vendas, setVendas] = useState<Venda[]>([
    {
      id: 1,
      cliente: clientes[0],
      itens: [
        { produto: produtos[0], quantidade: 2, subtotal: 31.80 }
      ],
      total: 31.80,
      data: "08/06/2025"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<number | null>(null);
  const [itensVenda, setItensVenda] = useState<ItemVenda[]>([]);

  const { toast } = useToast();

  const adicionarItem = (produtoId: number, quantidade: number) => {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return;

    if (quantidade > produto.quantidade) {
      toast({
        title: "Erro",
        description: "Quantidade indisponível em estoque",
        variant: "destructive"
      });
      return;
    }

    const itemExistente = itensVenda.find(item => item.produto.id === produtoId);
    
    if (itemExistente) {
      setItensVenda(itensVenda.map(item => 
        item.produto.id === produtoId 
          ? { ...item, quantidade: quantidade, subtotal: quantidade * produto.preco }
          : item
      ));
    } else {
      const novoItem: ItemVenda = {
        produto,
        quantidade,
        subtotal: quantidade * produto.preco
      };
      setItensVenda([...itensVenda, novoItem]);
    }
  };

  const removerItem = (produtoId: number) => {
    setItensVenda(itensVenda.filter(item => item.produto.id !== produtoId));
  };

  const calcularTotal = () => {
    return itensVenda.reduce((total, item) => total + item.subtotal, 0);
  };

  const finalizarVenda = () => {
    if (!clienteSelecionado || itensVenda.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione um cliente e adicione pelo menos um item",
        variant: "destructive"
      });
      return;
    }

    const cliente = clientes.find(c => c.id === clienteSelecionado);
    if (!cliente) return;

    const novaVenda: Venda = {
      id: vendas.length + 1,
      cliente,
      itens: [...itensVenda],
      total: calcularTotal(),
      data: new Date().toLocaleDateString('pt-BR')
    };

    setVendas([novaVenda, ...vendas]);
    setItensVenda([]);
    setClienteSelecionado(null);
    setShowForm(false);

    toast({
      title: "Sucesso",
      description: "Venda registrada com sucesso!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Leaf className="h-8 w-8 text-green-600" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Registro de Vendas</h1>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Venda
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="space-y-6 mb-8">
            {/* Seleção de Cliente */}
            <Card>
              <CardHeader>
                <CardTitle>Selecionar Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {clientes.map((cliente) => (
                    <div
                      key={cliente.id}
                      onClick={() => setClienteSelecionado(cliente.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        clienteSelecionado === cliente.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="font-medium">{cliente.nome}</h3>
                      <p className="text-sm text-gray-600">{cliente.telefone}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seleção de Produtos */}
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {produtos.map((produto) => (
                    <div key={produto.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{produto.nome}</h3>
                        <p className="text-sm text-gray-600">
                          R$ {produto.preco.toFixed(2)} - Estoque: {produto.quantidade}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max={produto.quantidade}
                          placeholder="Qtd"
                          className="w-20"
                          onChange={(e) => {
                            const quantidade = parseInt(e.target.value) || 0;
                            if (quantidade > 0) {
                              adicionarItem(produto.id, quantidade);
                            } else {
                              removerItem(produto.id);
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Itens da Venda */}
            {itensVenda.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Itens da Venda</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Preço Unit.</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itensVenda.map((item) => (
                        <TableRow key={item.produto.id}>
                          <TableCell>{item.produto.nome}</TableCell>
                          <TableCell>{item.quantidade}</TableCell>
                          <TableCell>R$ {item.produto.preco.toFixed(2)}</TableCell>
                          <TableCell>R$ {item.subtotal.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removerItem(item.produto.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="font-bold">Total</TableCell>
                        <TableCell className="font-bold">R$ {calcularTotal().toFixed(2)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={finalizarVenda}>Finalizar Venda</Button>
                    <Button variant="outline" onClick={() => setShowForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Lista de Vendas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Vendas Realizadas ({vendas.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendas.map((venda) => (
                  <TableRow key={venda.id}>
                    <TableCell>{venda.data}</TableCell>
                    <TableCell>{venda.cliente.nome}</TableCell>
                    <TableCell>
                      {venda.itens.map((item, index) => (
                        <div key={index} className="text-sm">
                          {item.quantidade}x {item.produto.nome}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="font-medium">R$ {venda.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Vendas;
