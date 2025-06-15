
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface ProductHeaderProps {
  onNovoProdutoClick: () => void;
}

const ProductHeader = ({ onNovoProdutoClick }: ProductHeaderProps) => {
  return (
    <>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="text-viveiro-green">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <span className="text-gray-400">/</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-viveiro-gray-dark">Produtos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-viveiro-gray-dark">Lista de Produtos</h1>
        </div>
        <Button
          className="bg-viveiro-green hover:bg-viveiro-green/90 text-white gap-2"
          onClick={onNovoProdutoClick}
        >
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>
    </>
  );
};

export default ProductHeader;
