
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProdutos } from "@/services/produtosService";
import { getMovimentacoes } from "@/services/movimentacaoEstoqueService";
import { Produto } from "@/types/produto";
import { MovimentacaoItem } from "@/types/movimentacao";
import ProductStockTable from "@/components/estoque/ProductStockTable";
import StockHistoryTable from "@/components/estoque/StockHistoryTable";
import MovimentacaoEstoqueModal from "@/components/MovimentacaoEstoqueModal";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Estoque = () => {
  const [activeTab, setActiveTab] = useState("estoque");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Produto | undefined>(undefined);
  const [historyFilter, setHistoryFilter] = useState<string | null>(null);

  const { data: produtos = [], isLoading: isLoadingProdutos } = useQuery<Produto[]>({
    queryKey: ['produtos'],
    queryFn: getProdutos,
  });

  const { data: movimentacoes = [], isLoading: isLoadingMovimentacoes } = useQuery<MovimentacaoItem[]>({
    queryKey: ['movimentacoesEstoque'],
    queryFn: getMovimentacoes,
  });

  const handleNovaMovimentacao = (produto?: Produto) => {
    setSelectedProduct(produto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(undefined);
  };
  
  const handleSaveMovimentacao = (movimentacao: { produtoId: string; tipo: string; quantidade: number; descricao: string; }) => {
    // A lógica de salvar será implementada em seguida.
    // Por enquanto, esta ação está desabilitada para focarmos na restauração da interface.
    console.log("Tentativa de salvar movimentação:", movimentacao);
    toast({
      title: "Em desenvolvimento",
      description: "A função de salvar a movimentação de estoque será habilitada em breve.",
      variant: "default",
    });
    handleCloseModal();
  };

  const handleViewHistory = (produtoNome: string) => {
    setHistoryFilter(produtoNome);
    setActiveTab("historico");
  };

  const handleClearHistoryFilter = () => {
    setHistoryFilter(null);
  };

  const isLoading = isLoadingProdutos || isLoadingMovimentacoes;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Controle de Estoque</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="estoque" className="gap-2">
            <Package className="h-4 w-4" />
            Estoque de Produtos
          </TabsTrigger>
          <TabsTrigger value="historico" className="gap-2">
            <History className="h-4 w-4" />
            Histórico de Movimentações
          </TabsTrigger>
        </TabsList>
        <Card className="mt-4">
          <CardContent className="p-6">
            <TabsContent value="estoque">
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <ProductStockTable 
                  produtos={produtos} 
                  onNovaMovimentacao={handleNovaMovimentacao}
                  onViewHistory={handleViewHistory}
                />
              )}
            </TabsContent>
            <TabsContent value="historico">
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <StockHistoryTable
                  movimentacoes={movimentacoes}
                  historyFilter={historyFilter}
                  onClearFilter={handleClearHistoryFilter}
                />
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      
      {isModalOpen && (
        <MovimentacaoEstoqueModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          produto={selectedProduct}
          produtos={produtos}
          onSave={handleSaveMovimentacao}
        />
      )}
    </div>
  );
};

export default Estoque;

