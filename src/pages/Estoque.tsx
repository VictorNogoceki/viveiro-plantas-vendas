
import { useState } from "react";
import { Package, Plus, Search, RotateCcw, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Link } from "react-router-dom";
import MovimentacaoEstoqueModal from "@/components/MovimentacaoEstoqueModal";

interface EstoqueItem {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  estoque: number;
  unidade: string;
  status: "normal" | "baixo";
}

interface MovimentacaoItem {
  id: number;
  data: string;
  tipo: "entrada" | "saida";
  produto: string;
  quantidade: number;
  usuario: string;
  observacao?: string;
}

const Estoque = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<EstoqueItem | undefined>();

  const estoqueItems: EstoqueItem[] = [
    {
      id: 1,
      codigo: "PLT001",
      nome: "ROSA VERMELHA",
      categoria: "Flores",
      estoque: 25,
      unidade: "UN",
      status: "normal"
    },
    {
      id: 2,
      codigo: "PLT002",
      nome: "SAMAMBAIA",
      categoria: "Folhagem",
      estoque: 8,
      unidade: "UN",
      status: "baixo"
    },
    {
      id: 3,
      codigo: "PLT003",
      nome: "SUCULENTA ECHEVERIA",
      categoria: "Suculentas",
      estoque: 45,
      unidade: "UN",
      status: "normal"
    },
    {
      id: 4,
      codigo: "PLT004",
      nome: "ORQUÍDEA PHALAENOPSIS",
      categoria: "Flores",
      estoque: 5,
      unidade: "UN",
      status: "baixo"
    }
  ];

  const movimentacoes: MovimentacaoItem[] = [
    {
      id: 1,
      data: "2024-06-14 10:30",
      tipo: "entrada",
      produto: "ROSA VERMELHA",
      quantidade: 25,
      usuario: "Admin",
      observacao: "Compra fornecedor"
    },
    {
      id: 2,
      data: "2024-06-14 09:15",
      tipo: "saida",
      produto: "SAMAMBAIA",
      quantidade: 2,
      usuario: "Admin",
      observacao: "Venda"
    }
  ];

  const filteredEstoque = estoqueItems.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNovaMovimentacao = (produto?: EstoqueItem) => {
    setProdutoSelecionado(produto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProdutoSelecionado(undefined);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="text-green-600">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <span className="text-gray-400">/</span>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900">Estoque</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Tabs */}
        <Tabs defaultValue="produtos" className="w-full">
          <TabsList className="grid w-fit grid-cols-2 mb-6 bg-white border-b">
            <TabsTrigger 
              value="produtos" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent text-gray-600"
            >
              Produtos em Estoque
            </TabsTrigger>
            <TabsTrigger 
              value="historico" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent text-gray-600"
            >
              Histórico de Movimentações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="produtos">
            {/* Actions */}
            <div className="flex items-center justify-between mb-6">
              <Button 
                onClick={() => handleNovaMovimentacao()}
                className="bg-green-500 hover:bg-green-600 text-white gap-2 rounded-md"
              >
                <Plus className="h-4 w-4" />
                Nova Movimentação
              </Button>
              
              <div className="relative w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, código ou categoria"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="text-gray-700 font-medium">Código</TableHead>
                    <TableHead className="text-gray-700 font-medium">Nome</TableHead>
                    <TableHead className="text-gray-700 font-medium">Categoria</TableHead>
                    <TableHead className="text-gray-700 font-medium">Estoque</TableHead>
                    <TableHead className="text-right text-gray-700 font-medium">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEstoque.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50 border-b border-gray-100">
                      <TableCell className="font-mono text-sm text-gray-900">{item.codigo}</TableCell>
                      <TableCell className="font-medium text-gray-900">{item.nome}</TableCell>
                      <TableCell className="text-gray-700">{item.categoria}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={item.status === "baixo" ? "text-green-600 font-semibold" : "text-gray-900"}>
                            {item.estoque} {item.unidade}
                          </span>
                          {item.status === "baixo" && (
                            <Badge className="bg-green-100 text-green-600 text-xs border-green-200">
                              Baixo
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            size="sm" 
                            onClick={() => handleNovaMovimentacao(item)}
                            className="bg-green-500 hover:bg-green-600 text-white gap-1 text-xs px-3 py-1 h-8"
                          >
                            <Plus className="h-3 w-3" />
                            Movimentar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="gap-1 text-xs px-3 py-1 h-8 border-gray-300 text-gray-600 hover:bg-gray-50"
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

              {filteredEstoque.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum produto encontrado</p>
                  <p className="text-sm">Tente ajustar os filtros de busca</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" className="text-green-600" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive className="bg-green-600 text-white border-green-600">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" className="text-green-600" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TabsContent>

          <TabsContent value="historico">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="text-gray-700 font-medium">Data/Hora</TableHead>
                    <TableHead className="text-gray-700 font-medium">Tipo</TableHead>
                    <TableHead className="text-gray-700 font-medium">Produto</TableHead>
                    <TableHead className="text-gray-700 font-medium">Quantidade</TableHead>
                    <TableHead className="text-gray-700 font-medium">Usuário</TableHead>
                    <TableHead className="text-gray-700 font-medium">Observação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimentacoes.map((mov) => (
                    <TableRow key={mov.id} className="hover:bg-gray-50 border-b border-gray-100">
                      <TableCell className="font-mono text-sm text-gray-900">{mov.data}</TableCell>
                      <TableCell>
                        <Badge 
                          className={mov.tipo === "entrada" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}
                        >
                          {mov.tipo === "entrada" ? "Entrada" : "Saída"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{mov.produto}</TableCell>
                      <TableCell className="text-gray-900">{mov.quantidade}</TableCell>
                      <TableCell className="text-gray-900">{mov.usuario}</TableCell>
                      <TableCell className="text-gray-600">{mov.observacao}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal de Movimentação */}
        <MovimentacaoEstoqueModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          produto={produtoSelecionado}
          produtos={estoqueItems}
        />
      </div>
    </div>
  );
};

export default Estoque;
