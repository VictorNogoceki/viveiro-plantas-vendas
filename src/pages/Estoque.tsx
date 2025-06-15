
import { useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import MovimentacaoEstoqueModal from "@/components/MovimentacaoEstoqueModal";
import { useToast } from "@/hooks/use-toast";
import { useProductStore } from "@/store/products";
import { Produto } from "@/types/produto";
import { MovimentacaoItem } from "@/types/movimentacao";
import ProductStockTable from "@/components/estoque/ProductStockTable";
import StockHistoryTable from "@/components/estoque/StockHistoryTable";

const Estoque = () => {
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
            <ProductStockTable
              produtos={estoqueItems}
              onNovaMovimentacao={handleNovaMovimentacao}
              onViewHistory={handleViewHistory}
            />
          </TabsContent>

          <TabsContent value="historico">
            <StockHistoryTable
              movimentacoes={movimentacoes}
              historyFilter={historyFilter}
              onClearFilter={() => setHistoryFilter(null)}
            />
          </TabsContent>
        </Tabs>

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
