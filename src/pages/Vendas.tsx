
import { useState } from "react";
import { ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Vendas = () => {
  const [vendas, setVendas] = useState([
    {
      id: 1,
      cliente: "Maria Santos",
      produtos: "2x Rosa Vermelha, 1x Violeta",
      valor: 45.90,
      data: "08/06/2025"
    }
  ]);

  const { toast } = useToast();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold text-gray-900">Registro de Vendas</h1>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Venda
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 bg-gradient-to-br from-green-50 to-blue-50">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Vendas Realizadas ({vendas.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Produtos</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendas.map((venda) => (
                      <TableRow key={venda.id}>
                        <TableCell className="font-medium">{venda.cliente}</TableCell>
                        <TableCell>{venda.produtos}</TableCell>
                        <TableCell>R$ {venda.valor.toFixed(2)}</TableCell>
                        <TableCell>{venda.data}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Vendas;
