
import { useState } from "react";
import { Package, Plus, Search, History, Move, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Produto {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  estoque: number;
  estoqueMinimo: number;
  preco: number;
}

const Produtos = () => {
  const [produtos] = useState<Produto[]>([
    {
      id: 1,
      codigo: "PLT001",
      nome: "Rosa Vermelha",
      categoria: "Flores",
      estoque: 25,
      estoqueMinimo: 10,
      preco: 15.90
    },
    {
      id: 2,
      codigo: "PLT002", 
      nome: "Samambaia",
      categoria: "Folhagem",
      estoque: 8,
      estoqueMinimo: 15,
      preco: 25.00
    },
    {
      id: 3,
      codigo: "PLT003",
      nome: "Suculenta Echeveria",
      categoria: "Suculentas",
      estoque: 45,
      estoqueMinimo: 20,
      preco: 12.50
    },
    {
      id: 4,
      codigo: "PLT004",
      nome: "Orquídea Phalaenopsis",
      categoria: "Flores",
      estoque: 5,
      estoqueMinimo: 8,
      preco: 85.00
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMovimentacao = (produto: Produto) => {
    toast({
      title: "Movimentação",
      description: `Iniciando movimentação para ${produto.nome}`,
    });
  };

  const handleHistorico = (produto: Produto) => {
    toast({
      title: "Histórico",
      description: `Visualizando histórico de ${produto.nome}`,
    });
  };

  const getStatusBadge = (estoque: number, estoqueMinimo: number) => {
    if (estoque <= estoqueMinimo) {
      return <Badge variant="destructive" className="bg-orange-500">Estoque Baixo</Badge>;
    }
    return <Badge variant="default" className="bg-green-500">Normal</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Estoque</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Estoque</h1>
            <p className="text-gray-600 mt-1">Controle e monitore seu inventário de plantas</p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
            <Plus className="h-4 w-4" />
            Nova Movimentação
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="estoque" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="estoque">Produtos em Estoque</TabsTrigger>
            <TabsTrigger value="historico">Histórico de Movimentações</TabsTrigger>
          </TabsList>

          <TabsContent value="estoque">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Produtos em Estoque ({filteredProdutos.length})
                    </CardTitle>
                    <CardDescription>
                      Visualize e gerencie todos os produtos do seu estoque
                    </CardDescription>
                  </div>
                  <div className="relative w-80">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nome, código ou categoria..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProdutos.map((produto) => (
                      <TableRow key={produto.id}>
                        <TableCell className="font-mono text-sm">{produto.codigo}</TableCell>
                        <TableCell className="font-medium">{produto.nome}</TableCell>
                        <TableCell>{produto.categoria}</TableCell>
                        <TableCell>
                          <span className={produto.estoque <= produto.estoqueMinimo ? "text-orange-600 font-semibold" : "text-gray-900"}>
                            {produto.estoque} unidades
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(produto.estoque, produto.estoqueMinimo)}
                        </TableCell>
                        <TableCell>R$ {produto.preco.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleMovimentacao(produto)}
                              className="gap-1"
                            >
                              <Move className="h-3 w-3" />
                              Movimentar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleHistorico(produto)}
                              className="gap-1"
                            >
                              <History className="h-3 w-3" />
                              Histórico
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredProdutos.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum produto encontrado</p>
                    <p className="text-sm">Tente ajustar os filtros de busca</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historico">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Histórico de Movimentações
                </CardTitle>
                <CardDescription>
                  Acompanhe todas as movimentações de entrada e saída do estoque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Histórico em desenvolvimento</h3>
                  <p>Esta funcionalidade será implementada em breve</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Produtos;
