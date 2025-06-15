
import { useQuery } from '@tanstack/react-query';
import { getVendasSemNotaFiscal } from '@/services/vendasService';
import { Venda } from '@/types/venda';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface SelecionarVendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVenda: (vendaId: string) => void;
  isCreating: boolean;
}

const SelecionarVendaModal = ({ isOpen, onClose, onSelectVenda, isCreating }: SelecionarVendaModalProps) => {
  const { data: vendas, isLoading, isError } = useQuery<Venda[]>({
    queryKey: ['vendas-sem-nota'],
    queryFn: getVendasSemNotaFiscal,
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Selecionar Venda para Gerar Nota Fiscal</DialogTitle>
          <DialogDescription>
            Escolha uma venda da lista abaixo para gerar a nota fiscal correspondente.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-9 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-red-500">
                    Erro ao carregar as vendas.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && vendas?.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    Nenhuma venda pendente de nota fiscal.
                  </TableCell>
                </TableRow>
              )}
              {vendas?.map((venda) => (
                <TableRow key={venda.id}>
                  <TableCell>{venda.clientes?.nome || 'Cliente não identificado'}</TableCell>
                  <TableCell>{new Date(venda.data_venda).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right">R$ {venda.valor_total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      onClick={() => onSelectVenda(venda.id)}
                      disabled={isCreating}
                    >
                      {isCreating ? 'Gerando...' : 'Gerar NF'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelecionarVendaModal;
