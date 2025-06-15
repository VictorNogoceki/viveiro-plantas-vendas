
import { Package, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Produto } from "@/types/produto";

interface ProductTableProps {
  produtos: Produto[];
  onEdit: (produto: Produto) => void;
  onDelete: (produto: Produto) => void;
}

const ProductTable = ({ produtos, onEdit, onDelete }: ProductTableProps) => {
  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-20">Imagem</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.map((produto) => (
                <TableRow key={produto.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                      <img 
                        src={produto.imagem} 
                        alt={produto.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{produto.codigo}</TableCell>
                  <TableCell className="font-medium">{produto.nome}</TableCell>
                  <TableCell>
                    <span className="text-viveiro-gray-dark">
                      {produto.categoria}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={produto.estoque <= 10 ? "text-red-600 font-semibold" : "text-viveiro-gray-dark"}>
                      {produto.estoque}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-viveiro-gray-dark">R$ {produto.preco.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => onEdit(produto)}
                        className="text-gray-500 hover:text-viveiro-green p-1"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => onDelete(produto)}
                        className="text-gray-500 hover:text-red-600 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {produtos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum produto encontrado</p>
              <p className="text-sm">Tente ajustar os filtros de busca</p>
            </div>
          )}
        </CardContent>
      </Card>

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
    </>
  );
};

export default ProductTable;
