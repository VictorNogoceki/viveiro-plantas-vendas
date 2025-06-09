
import { useState } from "react";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold text-gray-900">Notas Fiscais</h1>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Nota Fiscal
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 bg-gradient-to-br from-green-50 to-blue-50">
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
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default NotasFiscais;
