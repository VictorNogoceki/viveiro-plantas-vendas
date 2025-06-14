
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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

  const handleSubmit = () => {
    const novoRegistro = {
      id: Date.now(),
      data: new Date(data).toLocaleString('pt-BR'),
      descricao,
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
    onClose();
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
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Entrada" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saida">Saída</SelectItem>
              </SelectContent>
            </Select>
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
              className="w-full"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              * Descrição
            </Label>
            <Textarea
              placeholder="Descrição da movimentação"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full min-h-[60px]"
            />
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
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                className="w-full pl-8"
              />
            </div>
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
            disabled={!tipoMovimentacao || !data || !descricao || !valor}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NovoRegistroCaixaModal;
