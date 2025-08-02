
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { createMovimentacao } from "@/services/movimentacaoEstoqueService";
import { createVendaCompleta } from "@/services/vendasServiceComplete";
import { Produto } from "@/types/produto";
import { ItemCarrinho } from "@/types/carrinho";
import { formatCurrency } from "@/lib/utils";

export const useVendas = (produtos: Produto[] = []) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [clienteSearch, setClienteSearch] = useState("");
  const [produtoSearch, setProdutoSearch] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [isFinalizarModalOpen, setIsFinalizarModalOpen] = useState(false);
  const [isComprovanteOpen, setIsComprovanteOpen] = useState(false);
  const [ultimaVenda, setUltimaVenda] = useState<{
    carrinho: ItemCarrinho[];
    subtotal: number;
    formasPagamento: { nome: string; valor: number }[];
    vendaId: string;
  } | null>(null);
  
  useEffect(() => {
    if (!produtoSelecionado && produtos.length > 0) {
      setProdutoSelecionado(produtos[0]);
    }
  }, [produtos, produtoSelecionado]);

  const subtotal = carrinho.reduce((acc, item) => acc + item.total, 0);

  const adicionarAoCarrinho = (produto: Produto) => {
    const itemExistente = carrinho.find(item => item.produto.id === produto.id);
    
    if (itemExistente) {
      setCarrinho(carrinho.map(item =>
        item.produto.id === produto.id
          ? { ...item, quantidade: item.quantidade + 1, total: (item.quantidade + 1) * produto.preco }
          : item
      ));
    } else {
      setCarrinho([...carrinho, {
        produto,
        quantidade: 1,
        total: produto.preco
      }]);
    }

    toast({
      title: "Produto Adicionado",
      description: `${produto.nome} foi adicionado ao carrinho`,
    });
  };

  const removerDoCarrinho = (produtoId: string) => {
    setCarrinho(carrinho.filter(item => item.produto.id !== produtoId));
  };

  const atualizarQuantidade = (produtoId: string, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(produtoId);
      return;
    }

    setCarrinho(carrinho.map(item =>
      item.produto.id === produtoId
        ? { ...item, quantidade: novaQuantidade, total: novaQuantidade * item.produto.preco }
        : item
    ));
  };

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  const finalizarVenda = () => {
    if (carrinho.length === 0) {
      toast({
        title: "Carrinho Vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a venda",
        variant: "destructive"
      });
      return;
    }

    setIsFinalizarModalOpen(true);
  };

  const confirmarFinalizacao = async (formasPagamento: { nome: string; valor: number }[]) => {
    try {
      // Criar a venda completa no banco de dados (inclui venda, itens e fluxo de caixa)
      const vendaId = await createVendaCompleta(
        carrinho,
        subtotal,
        formasPagamento
      );

      // Criar movimentações de estoque
      const movimentacoesPromises = carrinho.map(item =>
        createMovimentacao({
          produtoId: item.produto.id,
          tipo: 'saida',
          quantidade: item.quantidade,
          motivo: `Venda - ID ${vendaId}`,
        })
      );

      await Promise.all(movimentacoesPromises);

      setUltimaVenda({
        carrinho: [...carrinho],
        subtotal,
        formasPagamento,
        vendaId
      });

      toast({
        title: "Venda Finalizada",
        description: `Venda realizada com sucesso! Total: ${formatCurrency(subtotal)}`,
      });

      // Invalidar queries para atualizar dados
      await queryClient.invalidateQueries({ queryKey: ['produtos'] });
      await queryClient.invalidateQueries({ queryKey: ['fluxo-caixa'] });

      setCarrinho([]);
      setClienteSearch("");
      setIsFinalizarModalOpen(false);
      setIsComprovanteOpen(true);

    } catch (error: any) {
      console.error("Erro ao finalizar venda:", error);
      toast({
        title: "Erro ao finalizar venda",
        description: error.message || "Não foi possível processar a venda.",
        variant: "destructive",
      });
    }
  };

  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  return {
    carrinho,
    clienteSearch,
    setClienteSearch,
    produtoSearch,
    setProdutoSearch,
    produtoSelecionado,
    setProdutoSelecionado,
    isFinalizarModalOpen,
    setIsFinalizarModalOpen,
    isComprovanteOpen,
    setIsComprovanteOpen,
    ultimaVenda,
    adicionarAoCarrinho,
    removerDoCarrinho,
    atualizarQuantidade,
    limparCarrinho,
    finalizarVenda,
    confirmarFinalizacao,
    subtotal,
    totalItens,
  };
};
