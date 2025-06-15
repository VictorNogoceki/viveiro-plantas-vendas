
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, ChevronDown, ShoppingCart, FilePlus2, FileUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getNotasFiscais, createNotaFiscalFromVenda } from "@/services/notasFiscaisService";
import SelecionarVendaModal from "@/components/SelecionarVendaModal";
import { NotaFiscal } from "@/types/notaFiscal";

const NotasFiscais = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notas, isLoading, isError } = useQuery<NotaFiscal[]>({
    queryKey: ['notasFiscais'],
    queryFn: getNotasFiscais,
  });

  const { mutate: createNota, isPending: isCreatingNota } = useMutation({
    mutationFn: createNotaFiscalFromVenda,
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Nota Fiscal criada com sucesso." });
      queryClient.invalidateQueries({ queryKey: ['notasFiscais'] });
      queryClient.invalidateQueries({ queryKey: ['vendas-sem-nota'] });
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleMenuClick = (feature: string) => {
    if (feature === 'Criar a partir de uma Venda') {
      setIsModalOpen(true);
    } else {
      toast({
        title: "Em desenvolvimento",
        description: `A funcionalidade de "${feature}" será implementada em breve.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Notas Fiscais</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Nota Fiscal
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Criar Nova Nota</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleMenuClick('Criar a partir de uma Venda')}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>A partir de uma Venda</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick('Criar Nota Fiscal Avulsa')}>
              <FilePlus2 className="mr-2 h-4 w-4" />
              <span>Nota Fiscal Avulsa</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleMenuClick('Importar XML')}>
              <FileUp className="mr-2 h-4 w-4" />
              <span>Importar XML</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notas Fiscais Emitidas ({notas?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                </TableRow>
              ))}
              {isError && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-red-500">Erro ao carregar as notas fiscais.</TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && notas?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">Nenhuma nota fiscal emitida.</TableCell>
                </TableRow>
              )}
              {notas?.map((nota) => (
                <TableRow key={nota.id}>
                  <TableCell className="font-medium">#{nota.numero}</TableCell>
                  <TableCell>{nota.cliente}</TableCell>
                  <TableCell>R$ {nota.valor.toFixed(2)}</TableCell>
                  <TableCell>{nota.data}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {nota.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <SelecionarVendaModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectVenda={createNota}
        isCreating={isCreatingNota}
      />
    </div>
  );
};

export default NotasFiscais;
