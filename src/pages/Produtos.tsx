import { useState } from "react";
import { Package, Plus, Search, Edit, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Produto {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  estoque: number;
  preco: number;
  imagem: string;
}

const Produtos = () => {
  const [produtos] = useState<Produto[]>([
    {
      id: 1,
      codigo: "PLT001",
      nome: "ROSA VERMELHA",
      categoria: "Flores",
      estoque: 25,
      preco: 15.90,
      imagem: "/lovable-uploads/f3ca6925-b6cb-459b-9eaa-422549153b2b.png"
    },
    {
      id: 2,
      codigo: "PLT002", 
      nome: "SAMAMBAIA",
      categoria: "Folhagem",
      estoque: 8,
      preco: 25.00,
      imagem: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=64&h=64&fit=crop&crop=center"
    },
    {
      id: 3,
      codigo: "PLT003",
      nome: "SUCULENTA ECHEVERIA",
      categoria: "Suculentas",
      estoque: 45,
      preco: 12.50,
      imagem: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=64&h=64&fit=crop&crop=center"
    },
    {
      id: 4,
      codigo: "PLT004",
      nome: "ORQUÍDEA PHALAENOPSIS",
      categoria: "Flores",
      estoque: 5,
      preco: 85.00,
      imagem: "https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?w=64&h=64&fit=crop&crop=center"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (produto: Produto) => {
    toast({
      title: "Editar Produto",
      description: `Editando ${produto.nome}`,
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
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="text-orange-600">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <span className="text-gray-400">/</span>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900">Produtos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lista de Produtos</h1>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar produto"
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
                {filteredProdutos.map((produto) => (
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
                      <span className={produto.categoria === "ÓLEO" ? "text-orange-600" : "text-gray-900"}>
                        {produto.categoria}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={produto.estoque <= 10 ? "text-red-600 font-semibold" : "text-gray-900"}>
                        {produto.estoque}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">R$ {produto.preco.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEdit(produto)}
                          className="text-gray-500 hover:text-orange-600 p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDelete(produto)}
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

            {filteredProdutos.length === 0 && (
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
      </div>
    </div>
  );
};

export default Produtos;
