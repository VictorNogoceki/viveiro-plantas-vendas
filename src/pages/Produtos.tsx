
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import EditProductDialog from "@/components/EditProductDialog";
import NovoProductDialog from "@/components/NovoProductDialog";
import { Produto } from "@/types/produto";
import { useProductStore } from "@/store/products";
import ProductHeader from "@/components/produtos/ProductHeader";
import ProductSearch from "@/components/produtos/ProductSearch";
import ProductTable from "@/components/produtos/ProductTable";

const Produtos = () => {
  const produtos = useProductStore((state) => state.produtos);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const createProduct = useProductStore((state) => state.createProduct);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNovoProdutoDialogOpen, setIsNovoProdutoDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (produto: Produto) => {
    setSelectedProduct(produto);
    setIsEditDialogOpen(true);
  };

  const handleSaveProduct = (updatedProduct: Produto) => {
    updateProduct(updatedProduct);
  };

  const handleCreateProduct = (newProductData: Omit<Produto, "id" | "unidade" | "imagem"> & { imagem?: string | undefined }) => {
    createProduct(newProductData);
    toast({
      title: "Produto Adicionado!",
      description: `${newProductData.nome} foi cadastrado com sucesso.`,
    });
  };

  const handleDelete = (produto: Produto) => {
    toast({
      title: "Excluir Produto",
      description: `Excluindo ${produto.nome}`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProductHeader onNovoProdutoClick={() => setIsNovoProdutoDialogOpen(true)} />
        <ProductSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <ProductTable produtos={filteredProdutos} onEdit={handleEdit} onDelete={handleDelete} />

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
