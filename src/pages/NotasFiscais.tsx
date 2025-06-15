
import { useState } from "react";
import { FileText, Plus, ChevronDown, ShoppingCart, FilePlus2, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NotasFiscais = () => {
  const [notas, setNotas] = useState([
    {
      id: 1,
      numero: "001",
      cliente: "João Silva",
      valor: 125.50,
      data: "08/06/2025",
      status: "Emitida"
    }
  ]);

  const { toast } = useToast();

  const handleMenuClick = (feature: string) => {
    toast({
      title: "Em desenvolvimento",
      description: `A funcionalidade de "${feature}" será implementada em breve.`,
    });
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
            Notas Fiscais Emitidas ({notas.length})
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
              {notas.map((nota) => (
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
    </div>
  );
};

export default NotasFiscais;
