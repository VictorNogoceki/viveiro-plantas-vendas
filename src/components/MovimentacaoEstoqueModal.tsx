import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StockMovementSchema, sanitizeInput } from "@/lib/validation";
import { logSecurityEvent } from "@/lib/security";
import { useToast } from "@/hooks/use-toast";

interface EstoqueItem {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  estoque: number;
  unidade: string;
  status: "normal" | "baixo";
}

interface MovimentacaoEstoqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  produto?: EstoqueItem;
  produtos: EstoqueItem[];
}

const MovimentacaoEstoqueModal = ({ isOpen, onClose, produto, produtos }: MovimentacaoEstoqueModalProps) => {
  const [produtoSelecionado, setProdutoSelecionado] = useState(produto?.id.toString() || "");
  const [tipoMovimentacao, setTipoMovimentacao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const produtoAtual = produtos.find(p => p.id.toString() === produtoSelecionado);

  const validateForm = (): boolean => {
    try {
      StockMovementSchema.parse({
        produtoId: produtoSelecionado,
        tipoMovimentacao,
        quantidade,
        descricao
      });
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      logSecurityEvent('Stock movement form validation failed', { errors: newErrors });
      return false;
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive"
      });
      return;
    }

    console.log("Movimentação:", {
      produto: produtoAtual,
      tipo: tipoMovimentacao,
      quantidade: parseInt(quantidade),
      descricao: sanitizeInput(descricao)
    });
    
    // Reset form
    setProdutoSelecionado("");
    setTipoMovimentacao("");
    setQuantidade("");
    setDescricao("");
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    
    switch (field) {
      case 'quantidade':
        setQuantidade(sanitizedValue);
        break;
      case 'descricao':
        setDescricao(sanitizedValue);
        break;
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Movimentação de Estoque
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Produto */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              * Produto
            </Label>
            <Select value={produtoSelecionado} onValueChange={setProdutoSelecionado}>
              <SelectTrigger className={`w-full ${errors.produtoId ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {produtos.map((prod) => (
                  <SelectItem key={prod.id} value={prod.id.toString()}>
                    {prod.codigo} - {prod.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.produtoId && <p className="text-sm text-red-500">{errors.produtoId}</p>}
          </div>

          {/* Tipo de Movimentação */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              * Tipo de Movimentação
            </Label>
            <Select value={tipoMovimentacao} onValueChange={setTipoMovimentacao}>
              <SelectTrigger className={`w-full ${errors.tipoMovimentacao ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Selecione o tipo de movimentação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada de Estoque</SelectItem>
                <SelectItem value="saida">Saída de Estoque</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipoMovimentacao && <p className="text-sm text-red-500">{errors.tipoMovimentacao}</p>}
          </div>

          {/* Quantidade */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              * Quantidade
            </Label>
            <Input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => handleInputChange('quantidade', e.target.value)}
              placeholder="Ex: 10 (quantidade)"
              className={`w-full ${errors.quantidade ? "border-red-500" : ""}`}
            />
            {errors.quantidade && <p className="text-sm text-red-500">{errors.quantidade}</p>}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              * Descrição
            </Label>
            <Textarea
              placeholder="Ex: Compra de fornecedor, devolução, inventário, etc."
              value={descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              className={`w-full min-h-[80px] ${errors.descricao ? "border-red-500" : ""}`}
              maxLength={200}
            />
            {errors.descricao && <p className="text-sm text-red-500">{errors.descricao}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-viveiro-green hover:bg-viveiro-green/90 text-white"
          >
            Confirmar Movimentação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovimentacaoEstoqueModal;
