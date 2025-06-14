
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

  const estoqueItems: EstoqueItem[] = [
    {
      id: 1,
      codigo: "50",
      nome: "AÇÚCAR",
      categoria: "Geral",
      estoque: 40,
      unidade: "UN",
      status: "normal"
    },
    {
      id: 2,
      codigo: "10",
      nome: "ARROZ 5KG TIO JOÃO",
      categoria: "Geral",
      estoque: 7,
      unidade: "UN",
      status: "baixo"
    },
    {
      id: 3,
      codigo: "1002",
      nome: "CAFÉ PILÃO",
      categoria: "Geral",
      estoque: 94,
      unidade: "UN",
      status: "normal"
    },
    {
      id: 4,
      codigo: "142",
      nome: "ÓLEO DE SOJA LIZA PET 900ML",
      categoria: "ÓLEO",
      estoque: 1,
      unidade: "L",
      status: "baixo"
    }
  ];

  const movimentacoes: MovimentacaoItem[] = [
    {
      id: 1,
      data: "2024-06-14 10:30",
      tipo: "entrada",
      produto: "AÇÚCAR",
      quantidade: 50,
      usuario: "Admin",
      observacao: "Compra fornecedor"
    },
    {
      id: 2,
      data: "2024-06-14 09:15",
      tipo: "saida",
      produto: "ARROZ 5KG TIO JOÃO",
      quantidade: 3,
      usuario: "Admin",
      observacao: "Venda"
    }
  ];

  const filteredEstoque = estoqueItems.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="text-orange-600">Home</Link>
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

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Estoque</h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="produtos" className="w-full">
          <TabsList className="grid w-fit grid-cols-2 mb-6">
            <TabsTrigger value="produtos" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Produtos em Estoque
            </TabsTrigger>
            <TabsTrigger value="historico" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Histórico de Movimentações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="produtos">
            {/* Actions */}
            <div className="flex items-center justify-between mb-6">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
                <Plus className="h-4 w-4" />
                Nova Movimentação
              </Button>
              
              <div className="relative w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, código ou categoria"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Products Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEstoque.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                        <TableCell className="font-medium">{item.nome}</TableCell>
                        <TableCell>
                          <span className={item.categoria === "ÓLEO" ? "text-orange-600" : "text-gray-900"}>
                            {item.categoria}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={item.status === "baixo" ? "text-orange-600 font-semibold" : "text-gray-900"}>
                              {item.estoque} {item.unidade}
                            </span>
                            {item.status === "baixo" && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-600 text-xs">
                                Baixo
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              className="bg-orange-500 hover:bg-orange-600 text-white gap-1 text-xs px-3 py-1 h-8"
                            >
                              <Plus className="h-3 w-3" />
                              Movimentar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="gap-1 text-xs px-3 py-1 h-8"
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
              </CardContent>
            </Card>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TabsContent>

          <TabsContent value="historico">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Observação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movimentacoes.map((mov) => (
                      <TableRow key={mov.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-sm">{mov.data}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={mov.tipo === "entrada" ? "default" : "secondary"}
                            className={mov.tipo === "entrada" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                          >
                            {mov.tipo === "entrada" ? "Entrada" : "Saída"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{mov.produto}</TableCell>
                        <TableCell>{mov.quantidade}</TableCell>
                        <TableCell>{mov.usuario}</TableCell>
                        <TableCell className="text-gray-600">{mov.observacao}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Estoque;
