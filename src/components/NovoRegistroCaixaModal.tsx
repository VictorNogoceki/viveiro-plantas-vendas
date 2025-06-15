import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CashFlowSchema, sanitizeInput } from "@/lib/validation";
import { logSecurityEvent } from "@/lib/security";
import { useToast } from "@/hooks/use-toast";

interface NovoRegistroCaixaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (registro: any) => void;
}

const NovoRegistroCaixaModal = ({ isOpen, onClose, onConfirm }: NovoRegistroCaixaModalProps) => {
  const [tipoMovimentacao, setTipoMovimentacao] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 16));
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    try {
      CashFlowSchema.parse({
        tipoMovimentacao,
        data,
        descricao,
        valor,
        formaPagamento: formaPagamento || undefined
      });
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      logSecurityEvent('Cash flow form validation failed', { errors: newErrors });
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

    const novoRegistro = {
      id: Date.now(),
      data: new Date(data).toLocaleString('pt-BR'),
      descricao: sanitizeInput(descricao),
      tipo: tipoMovimentacao === "entrada" ? "Entrada" : "Saída",
      formaPagamento: formaPagamento,
      valor: parseFloat(valor.replace(',', '.')) || 0
    };

    console.log("Novo registro:", novoRegistro);
    onConfirm(novoRegistro);
    
    // Reset form
    setTipoMovimentacao("");
    setData(new Date().toISOString().slice(0, 16));
    setDescricao("");
    setValor("");
    setFormaPagamento("");
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    
    switch (field) {
      case 'descricao':
        setDescricao(sanitizedValue);
        break;
      case 'valor':
        setValor(sanitizedValue);
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
            Novo Registro de Caixa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tipo de Movimentação */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              * Tipo de Movimentação
            </Label>
            <Select value={tipoMovimentacao} onValueChange={setTipoMovimentacao}>
              <SelectTrigger className={`w-full ${errors.tipoMovimentacao ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Entrada" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saida">Saída</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipoMovimentacao && <p className="text-sm text-red-500">{errors.tipoMovimentacao}</p>}
          </div>

          {/* Data */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              * Data
            </Label>
            <Input
              type="datetime-local"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className={`w-full ${errors.data ? "border-red-500" : ""}`}
            />
            {errors.data && <p className="text-sm text-red-500">{errors.data}</p>}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              * Descrição
            </Label>
            <Textarea
              placeholder="Descrição da movimentação"
              value={descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              className={`w-full min-h-[60px] ${errors.descricao ? "border-red-500" : ""}`}
              maxLength={200}
            />
            {errors.descricao && <p className="text-sm text-red-500">{errors.descricao}</p>}
          </div>

          {/* Valor */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              * Valor
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                R$
              </span>
              <Input
                type="text"
                value={valor}
                onChange={(e) => handleInputChange('valor', e.target.value)}
                placeholder="0,00"
                className={`w-full pl-8 ${errors.valor ? "border-red-500" : ""}`}
              />
            </div>
            {errors.valor && <p className="text-sm text-red-500">{errors.valor}</p>}
          </div>

          {/* Forma de Pagamento */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              Forma de Pagamento
            </Label>
            <Select value={formaPagamento} onValueChange={setFormaPagamento}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                <SelectItem value="Crédito">Cartão de Crédito</SelectItem>
                <SelectItem value="Débito">Cartão de Débito</SelectItem>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="Transferência">Transferência</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="-">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-viveiro-green hover:bg-viveiro-green/90 text-white"
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovoRegistroCaixaModal;
