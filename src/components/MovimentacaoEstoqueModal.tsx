
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

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
  const [tipoMovimentacao, setTipoMovimentacao] = useState("entrada");
  const [quantidade, setQuantidade] = useState("1");
  const [descricao, setDescricao] = useState("");

  const produtoAtual = produtos.find(p => p.id.toString() === produtoSelecionado);

  const handleSubmit = () => {
    console.log("Movimentação:", {
      produto: produtoAtual,
      tipo: tipoMovimentacao,
      quantidade: parseInt(quantidade),
      descricao
    });
    
    // Reset form
    setProdutoSelecionado("");
    setTipoMovimentacao("entrada");
    setQuantidade("1");
    setDescricao("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Movimentação de Estoque
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 rounded-sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          {/* Produto */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              * Produto
            </Label>
            <Select value={produtoSelecionado} onValueChange={setProdutoSelecionado}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {produtos.map((prod) => (
                  <SelectItem key={prod.id} value={prod.id.toString()}>
                    {prod.codigo} - {prod.nome} (Estoque atual: {prod.estoque} {prod.unidade})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Movimentação */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              * Tipo de Movimentação
            </Label>
            <Select value={tipoMovimentacao} onValueChange={setTipoMovimentacao}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">✅ Entrada de Estoque</SelectItem>
                <SelectItem value="saida">❌ Saída de Estoque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Info sobre o tipo */}
          {tipoMovimentacao === "entrada" && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-700">
                📈 Entrada - Aumenta o estoque do produto
              </p>
            </div>
          )}

          {tipoMovimentacao === "saida" && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-700">
                📉 Saída - Diminui o estoque do produto
              </p>
            </div>
          )}

          {/* Quantidade */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              * Quantidade
            </Label>
            <Input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              * Descrição
            </Label>
            <Textarea
              placeholder="Ex: Compra de fornecedor, devolução, inventário, etc."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full min-h-[80px]"
            />
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
            disabled={!produtoSelecionado || !quantidade || !descricao}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
          >
            Confirmar Movimentação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovimentacaoEstoqueModal;
