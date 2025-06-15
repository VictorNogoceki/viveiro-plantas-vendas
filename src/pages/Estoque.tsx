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
import { useToast } from "@/hooks/use-toast";
import { useProductStore } from "@/store/products";
import { Produto } from "@/types/produto";

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
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | undefined>();
  const [activeTab, setActiveTab] = useState("produtos");
  const [historyFilter, setHistoryFilter] = useState<string | null>(null);
  const { toast } = useToast();

  const estoqueItems = useProductStore((state) => state.produtos);
  const updateStock = useProductStore((state) => state.updateStock);

  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoItem[]>([
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
  ]);

  const filteredEstoque = estoqueItems.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMovimentacoes = historyFilter
    ? movimentacoes.filter(mov => mov.produto.toLowerCase() === historyFilter.toLowerCase())
    : movimentacoes;

  const handleNovaMovimentacao = (produto?: Produto) => {
    setProdutoSelecionado(produto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProdutoSelecionado(undefined);
  };

  const handleViewHistory = (produtoNome: string) => {
    setHistoryFilter(produtoNome);
    setActiveTab("historico");
  };

  const handleSaveMovimentacao = (movimentacao: { produtoId: string; tipo: string; quantidade: number; descricao: string; }) => {
    const { produtoId, tipo, quantidade, descricao } = movimentacao;

    const produto = estoqueItems.find(item => item.id.toString() === produtoId);
    if (!produto) return;

    const newStock = tipo === 'entrada' ? produto.estoque + quantidade : produto.estoque - quantidade;
    updateStock(produto.id, newStock);

    if (produto.nome) {
      const novaMovimentacao: MovimentacaoItem = {
        id: movimentacoes.length + 1,
        data: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        tipo: tipo as "entrada" | "saida",
        produto: produto.nome,
        quantidade: quantidade,
        usuario: "Admin", // Assuming 'Admin' for now
        observacao: descricao
      };
      setMovimentacoes(prev => [novaMovimentacao, ...prev]);
    }

    toast({
      title: "Movimentação Realizada",
      description: "O estoque foi atualizado com sucesso."
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="text-primary">Home</Link>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                className="bg-primary hover:bg-primary/90 text-white gap-2 rounded-md"
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
                          <span className={item.estoque < 10 ? "text-destructive font-semibold" : "text-gray-900"}>
                            {item.estoque} {item.unidade}
                          </span>
                          {item.estoque < 10 && (
                            <Badge variant="secondary" className="bg-destructive/10 text-destructive text-xs border-destructive/20">
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
                            className="bg-primary hover:bg-primary/90 text-white gap-1 text-xs px-3 py-1 h-8"
                          >
                            <Plus className="h-3 w-3" />
                            Movimentar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewHistory(item.nome)}
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
                    <PaginationPrevious href="#" className="text-primary" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive className="bg-primary text-white border-primary">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" className="text-primary" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TabsContent>

          <TabsContent value="historico">
            {historyFilter && (
              <div className="flex items-center justify-between mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  Mostrando histórico para: <span className="font-semibold">{historyFilter}</span>
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHistoryFilter(null)}
                  className="text-blue-600 hover:bg-blue-100"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Limpar filtro
                </Button>
              </div>
            )}
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
                  {filteredMovimentacoes.length > 0 ? (
                    filteredMovimentacoes.map((mov) => (
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                        <History className="h-10 w-10 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">Nenhum histórico de movimentação encontrado</p>
                        {historyFilter && <p className="text-sm mt-1">Nenhuma movimentação para este produto.</p>}
                      </TableCell>
                    </TableRow>
                  )}
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
          onSave={handleSaveMovimentacao}
        />
      </div>
    </div>
  );
};

export default Estoque;
