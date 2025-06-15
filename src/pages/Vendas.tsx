
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import CarrinhoCompras from "@/components/CarrinhoCompras";
import SelecaoProdutos from "@/components/SelecaoProdutos";
import HeaderVendas from "@/components/HeaderVendas";
import FinalizarVendaModal from "@/components/FinalizarVendaModal";
import ComprovanteVenda from "@/components/ComprovanteVenda";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProdutos } from "@/services/produtosService";
import { createMovimentacao } from "@/services/movimentacaoEstoqueService";
import { Produto } from "@/types/produto";

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
  total: number;
}

const Vendas = () => {
  const queryClient = useQueryClient();
  const { data: produtos = [], isLoading: isLoadingProdutos } = useQuery<Produto[]>({
    queryKey: ['produtos'],
    queryFn: getProdutos,
  });

  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [clienteSearch, setClienteSearch] = useState("");
  const [produtoSearch, setProdutoSearch] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const { toast } = useToast();
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
    const vendaId = `${Date.now().toString().slice(-6)}`;

    try {
      // Usando Promise.all para enviar todas as solicitações de movimentação de estoque em paralelo.
      // Se uma falhar, a promessa inteira é rejeitada.
      // NOTA: Esta não é uma transação verdadeira. Se algumas movimentações tiverem sucesso antes que uma falhe,
      // elas não serão revertidas automaticamente. Uma função de banco de dados (RPC) seria necessária
      // para atomicidade completa.
      const movimentacoesPromises = carrinho.map(item =>
        createMovimentacao({
          produtoId: item.produto.id,
          tipo: 'saida',
          quantidade: item.quantidade,
          motivo: `Venda - ID ${vendaId}`,
        })
      );

      await Promise.all(movimentacoesPromises);

      // Se as atualizações de estoque forem bem-sucedidas, finalize a venda
      setUltimaVenda({
        carrinho: [...carrinho],
        subtotal,
        formasPagamento,
        vendaId
      });

      toast({
        title: "Venda Finalizada",
        description: `Venda realizada com sucesso! Total: R$ ${subtotal.toFixed(2)}`,
      });

      // Invalida a query de produtos para buscar os dados atualizados de estoque
      await queryClient.invalidateQueries({ queryKey: ['produtos'] });

      // Reseta o estado
      setCarrinho([]);
      setClienteSearch("");
      setIsFinalizarModalOpen(false);
      setIsComprovanteOpen(true);

    } catch (error: any) {
      console.error("Erro ao finalizar venda:", error);
      toast({
        title: "Erro ao finalizar venda",
        description: error.message || "Não foi possível atualizar o estoque.",
        variant: "destructive",
      });
    }
  };

  const subtotal = carrinho.reduce((acc, item) => acc + item.total, 0);
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <HeaderVendas />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CarrinhoCompras
            carrinho={carrinho}
            clienteSearch={clienteSearch}
            setClienteSearch={setClienteSearch}
            produtoSelecionado={produtoSelecionado}
            atualizarQuantidade={atualizarQuantidade}
            removerDoCarrinho={removerDoCarrinho}
            limparCarrinho={limparCarrinho}
            finalizarVenda={finalizarVenda}
            subtotal={subtotal}
            totalItens={totalItens}
          />

          <SelecaoProdutos
            produtos={produtos}
            produtoSearch={produtoSearch}
            setProdutoSearch={setProdutoSearch}
            produtoSelecionado={produtoSelecionado}
            setProdutoSelecionado={setProdutoSelecionado}
            adicionarAoCarrinho={adicionarAoCarrinho}
            isLoading={isLoadingProdutos}
          />
        </div>
      </div>

      <FinalizarVendaModal
        isOpen={isFinalizarModalOpen}
        onClose={() => setIsFinalizarModalOpen(false)}
        onConfirm={confirmarFinalizacao}
        subtotal={subtotal}
      />

      {ultimaVenda && (
        <ComprovanteVenda
          isOpen={isComprovanteOpen}
          onClose={() => setIsComprovanteOpen(false)}
          carrinho={ultimaVenda.carrinho}
          subtotal={ultimaVenda.subtotal}
          formasPagamento={ultimaVenda.formasPagamento}
          vendaId={ultimaVenda.vendaId}
        />
      )}
    </div>
  );
};

export default Vendas;
