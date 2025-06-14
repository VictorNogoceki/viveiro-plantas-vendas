
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
    setTipoMovimentacao("");
    setQuantidade("");
    setDescricao("");
    onClose();
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
              <SelectTrigger className="w-full">
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
          </div>

          {/* Tipo de Movimentação */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              * Tipo de Movimentação
            </Label>
            <Select value={tipoMovimentacao} onValueChange={setTipoMovimentacao}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo de movimentação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada de Estoque</SelectItem>
                <SelectItem value="saida">Saída de Estoque</SelectItem>
              </SelectContent>
            </Select>
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
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="Ex: 10 (quantidade)"
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
            disabled={!produtoSelecionado || !tipoMovimentacao || !quantidade || !descricao}
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
