
import CarrinhoCompras from "@/components/CarrinhoCompras";
import SelecaoProdutos from "@/components/SelecaoProdutos";
import HeaderVendas from "@/components/HeaderVendas";
import FinalizarVendaModal from "@/components/FinalizarVendaModal";
import ComprovanteVenda from "@/components/ComprovanteVenda";
import { useQuery } from "@tanstack/react-query";
import { getProdutos } from "@/services/produtosService";
import { Produto } from "@/types/produto";
import { useVendas } from "@/hooks/useVendas";

const Vendas = () => {
  const { data: produtos = [], isLoading: isLoadingProdutos } = useQuery<Produto[]>({
    queryKey: ['produtos'],
    queryFn: getProdutos,
  });

  const {
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
  } = useVendas(produtos);

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
