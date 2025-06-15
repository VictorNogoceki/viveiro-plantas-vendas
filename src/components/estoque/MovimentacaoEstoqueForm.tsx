
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StockMovementSchema, sanitizeInput } from "@/lib/validation";
import { Produto } from "@/types/produto";

type StockMovementFormValues = z.infer<typeof StockMovementSchema>;

interface MovimentacaoEstoqueFormProps {
  onSave: (movimentacao: {
    produtoId: string;
    tipo: 'entrada' | 'saida';
    quantidade: number;
    descricao: string;
  }) => void;
  onClose: () => void;
  produto?: Produto;
  produtos: Produto[];
}

export const MovimentacaoEstoqueForm = ({ onSave, onClose, produto, produtos }: MovimentacaoEstoqueFormProps) => {
  const form = useForm<StockMovementFormValues>({
    resolver: zodResolver(StockMovementSchema),
    defaultValues: {
      produtoId: produto?.id.toString() || "",
      quantidade: "",
      descricao: "",
    },
  });

  const onSubmit = (values: StockMovementFormValues) => {
    onSave({
      produtoId: values.produtoId,
      tipo: values.tipoMovimentacao as 'entrada' | 'saida',
      quantidade: typeof values.quantidade === 'string' ? parseInt(values.quantidade, 10) : values.quantidade,
      descricao: sanitizeInput(values.descricao),
    });
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="produtoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>* Produto</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={!!produto}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {produtos.map((prod) => (
                    <SelectItem key={prod.id} value={prod.id.toString()}>
                      {prod.codigo} - {prod.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tipoMovimentacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>* Tipo de Movimentação</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de movimentação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="entrada">Entrada de Estoque</SelectItem>
                  <SelectItem value="saida">Saída de Estoque</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>* Quantidade</FormLabel>
              <FormControl>
                <Input type="number" min="1" placeholder="Ex: 10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>* Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex: Compra de fornecedor, devolução, etc."
                  className="min-h-[80px]"
                  maxLength={200}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-viveiro-green hover:bg-viveiro-green/90 text-white"
          >
            Confirmar Movimentação
          </Button>
        </div>
      </form>
    </Form>
  );
};
