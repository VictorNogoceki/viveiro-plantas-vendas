
import { useState } from "react";
import MovimentacaoEstoqueModal from "@/components/MovimentacaoEstoqueModal";
import EstoqueHeader from "@/components/estoque/EstoqueHeader";
import EstoqueProdutos from "@/components/estoque/EstoqueProdutos";
import EstoqueHistorico from "@/components/estoque/EstoqueHistorico";
import { EstoqueItem, MovimentacaoItem } from "@/types/estoque";

const Estoque = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<EstoqueItem | undefined>();

  const estoqueItems: EstoqueItem[] = [
    {
      id: 1,
      codigo: "PLT001",
      nome: "ROSA VERMELHA",
      categoria: "Flores",
      estoque: 25,
      unidade: "UN",
      status: "normal"
    },
    {
      id: 2,
      codigo: "PLT002",
      nome: "SAMAMBAIA",
      categoria: "Folhagem",
      estoque: 8,
      unidade: "UN",
      status: "baixo"
    },
    {
      id: 3,
      codigo: "PLT003",
      nome: "SUCULENTA ECHEVERIA",
      categoria: "Suculentas",
      estoque: 45,
      unidade: "UN",
      status: "normal"
    },
    {
      id: 4,
      codigo: "PLT004",
      nome: "ORQUÍDEA PHALAENOPSIS",
      categoria: "Flores",
      estoque: 5,
      unidade: "UN",
      status: "baixo"
    }
  ];

  const movimentacoes: MovimentacaoItem[] = [
    {
      id: 1,
      data: "2024-06-14 10:30",
      tipo: "entrada",
      produto: "ROSA VERMELHA",
      quantidade: 25,
      usuario: "Admin",
      observacao: "Compra fornecedor"
    },
    {
      id: 2,
      data: "2024-06-14 09:15",
      tipo: "saida",
      produto: "SAMAMBAIA",
      quantidade: 2,
      usuario: "Admin",
      observacao: "Venda"
    }
  ];

  const handleNovaMovimentacao = (produto?: EstoqueItem) => {
    setProdutoSelecionado(produto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProdutoSelecionado(undefined);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <EstoqueHeader>
          <EstoqueProdutos 
            estoqueItems={estoqueItems}
            onNovaMovimentacao={handleNovaMovimentacao}
          />
          <EstoqueHistorico movimentacoes={movimentacoes} />
        </EstoqueHeader>

        <MovimentacaoEstoqueModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          produto={produtoSelecionado}
          produtos={estoqueItems}
        />
      </div>
    </div>
  );
};

export default Estoque;
