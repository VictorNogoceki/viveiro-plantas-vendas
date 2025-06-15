
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import EditProductDialog from "@/components/EditProductDialog";
import NovoProductDialog from "@/components/NovoProductDialog";
import { Produto } from "@/types/produto";
import ProductHeader from "@/components/produtos/ProductHeader";
import ProductSearch from "@/components/produtos/ProductSearch";
import ProductTable from "@/components/produtos/ProductTable";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProdutos, createProduto, updateProduto, deleteProduto } from '@/services/produtosService';
import { Skeleton } from "@/components/ui/skeleton";

const Produtos = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: produtos = [], isLoading, isError } = useQuery<Produto[]>({
    queryKey: ['produtos'],
    queryFn: getProdutos,
  });

  const createMutation = useMutation({
    mutationFn: createProduto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      toast({
        title: "Produto Adicionado!",
        description: "O novo produto foi cadastrado com sucesso.",
      });
      setIsNovoProdutoDialogOpen(false);
    },
    onError: (error) => {
       toast({
        title: "Erro ao adicionar produto",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateProduto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      toast({
        title: "Produto Atualizado!",
        description: "O produto foi atualizado com sucesso.",
      });
      setIsEditDialogOpen(false);
    },
     onError: (error) => {
       toast({
        title: "Erro ao atualizar produto",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduto,
    onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['produtos'] });
        const deletedProduct = produtos.find(p => p.id === variables);
        toast({
            title: "Produto Excluído!",
            description: `${deletedProduct?.nome || 'O produto'} foi excluído com sucesso.`,
        });
    },
    onError: (error) => {
        toast({
            title: "Erro ao excluir produto",
            description: error.message,
            variant: "destructive",
        });
    },
  });


  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNovoProdutoDialogOpen, setIsNovoProdutoDialogOpen] = useState(false);

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (produto.codigo && produto.codigo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (produto.categoria && produto.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (produto: Produto) => {
    setSelectedProduct(produto);
    setIsEditDialogOpen(true);
  };

  const handleSaveProduct = (updatedProduct: Produto) => {
    updateMutation.mutate(updatedProduct);
  };

  const handleCreateProduct = (newProductData: Omit<Produto, 'id' | 'unidade' | 'imagem' | 'created_at'> & { imagem?: string | undefined }) => {
    createMutation.mutate(newProductData);
  };

  const handleDelete = (produto: Produto) => {
    deleteMutation.mutate(produto.id);
  };
  
  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Ocorreu um erro!</h2>
          <p>Não foi possível carregar os produtos. Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProductHeader onNovoProdutoClick={() => setIsNovoProdutoDialogOpen(true)} />
        <ProductSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        {isLoading ? (
            <div className="space-y-2 mt-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        ) : (
            <ProductTable produtos={filteredProdutos} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        <EditProductDialog
          produto={selectedProduct}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveProduct}
        />
        
        <NovoProductDialog
          open={isNovoProdutoDialogOpen}
          onOpenChange={setIsNovoProdutoDialogOpen}
          onSave={handleCreateProduct}
        />
      </div>
    </div>
  );
};

export default Produtos;
