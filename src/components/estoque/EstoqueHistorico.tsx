
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MovimentacaoItem } from "@/types/estoque";

interface EstoqueHistoricoProps {
  movimentacoes: MovimentacaoItem[];
}

const EstoqueHistorico = ({ movimentacoes }: EstoqueHistoricoProps) => {
  return (
    <TabsContent value="historico">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              <TableHead className="text-gray-700 font-medium">Data/Hora</TableHead>
              <TableHead className="text-gray-700 font-medium">Tipo</TableHead>
              <TableHead className="text-gray-700 font-medium">Produto</TableHead>
              <TableHead className="text-gray-700 font-medium">Quantidade</TableHead>
              <TableHead className="text-gray-700 font-medium">Usuário</TableHead>
              <TableHead className="text-gray-700 font-medium">Observação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movimentacoes.map((mov) => (
              <TableRow key={mov.id} className="hover:bg-gray-50 border-b border-gray-100">
                <TableCell className="font-mono text-sm text-gray-900">{mov.data}</TableCell>
                <TableCell>
                  <Badge 
                    className={mov.tipo === "entrada" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}
                  >
                    {mov.tipo === "entrada" ? "Entrada" : "Saída"}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-gray-900">{mov.produto}</TableCell>
                <TableCell className="text-gray-900">{mov.quantidade}</TableCell>
                <TableCell className="text-gray-900">{mov.usuario}</TableCell>
                <TableCell className="text-gray-600">{mov.observacao}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TabsContent>
  );
};

export default EstoqueHistorico;
