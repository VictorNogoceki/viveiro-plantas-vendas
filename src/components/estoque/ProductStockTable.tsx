
import { useState } from "react";
import { Package, Plus, Search, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Produto } from "@/types/produto";

interface ProductStockTableProps {
  produtos: Produto[];
  onNovaMovimentacao: (produto?: Produto) => void;
  onViewHistory: (produtoNome: string) => void;
}

const ProductStockTable = ({ produtos, onNovaMovimentacao, onViewHistory }: ProductStockTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEstoque = produtos.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={() => onNovaMovimentacao()}
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
                      onClick={() => onNovaMovimentacao(item)}
                      className="bg-primary hover:bg-primary/90 text-white gap-1 text-xs px-3 py-1 h-8"
                    >
                      <Plus className="h-3 w-3" />
                      Movimentar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onViewHistory(item.nome)}
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
    </>
  );
};

export default ProductStockTable;
