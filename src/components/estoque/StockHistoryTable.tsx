
import { RotateCcw, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MovimentacaoItem } from "@/types/movimentacao";

interface StockHistoryTableProps {
  movimentacoes: MovimentacaoItem[];
  historyFilter: string | null;
  onClearFilter: () => void;
}

const StockHistoryTable = ({ movimentacoes, historyFilter, onClearFilter }: StockHistoryTableProps) => {
  const filteredMovimentacoes = historyFilter
    ? movimentacoes.filter(mov => mov.produto.toLowerCase() === historyFilter.toLowerCase())
    : movimentacoes;

  return (
    <>
      {historyFilter && (
        <div className="flex items-center justify-between mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            Mostrando histórico para: <span className="font-semibold">{historyFilter}</span>
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilter}
            className="text-blue-600 hover:bg-blue-100"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpar filtro
          </Button>
        </div>
      )}
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
            {filteredMovimentacoes.length > 0 ? (
              filteredMovimentacoes.map((mov) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                  <History className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">Nenhum histórico de movimentação encontrado</p>
                  {historyFilter && <p className="text-sm mt-1">Nenhuma movimentação para este produto.</p>}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default StockHistoryTable;
