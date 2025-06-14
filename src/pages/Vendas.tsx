
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import CarrinhoCompras from "@/components/CarrinhoCompras";
import SelecaoProdutos from "@/components/SelecaoProdutos";
import HeaderVendas from "@/components/HeaderVendas";
import FinalizarVendaModal from "@/components/FinalizarVendaModal";

interface Produto {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  estoque: number;
  preco: number;
  imagem: string;
}

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
  total: number;
}

const Vendas = () => {
  const [produtos] = useState<Produto[]>([
    {
      id: 1,
      codigo: "PLT001",
      nome: "ROSA VERMELHA",
      categoria: "Flores",
      estoque: 25,
      preco: 15.90,
      imagem: "/lovable-uploads/f3ca6925-b6cb-459b-9eaa-422549153b2b.png"
    },
    {
      id: 2,
      codigo: "PLT002", 
      nome: "SAMAMBAIA",
      categoria: "Folhagem",
      estoque: 8,
      preco: 25.00,
      imagem: "/lovable-uploads/4b16ca18-e502-4020-96ef-096f7dbea63d.png"
    },
    {
      id: 3,
      codigo: "PLT003",
      nome: "SUCULENTA ECHEVERIA",
      categoria: "Suculentas",
      estoque: 45,
      preco: 12.50,
      imagem: "/lovable-uploads/76b52c52-e6fb-4664-beb4-5dfa62c8869d.png"
    },
    {
      id: 4,
      codigo: "PLT004",
      nome: "ORQUÍDEA PHALAENOPSIS",
      categoria: "Flores",
      estoque: 5,
      preco: 85.00,
      imagem: "/lovable-uploads/56fd79a4-cedc-4c8d-a9fe-624dffa1d655.png"
    }
  ]);

  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [clienteSearch, setClienteSearch] = useState("");
  const [produtoSearch, setProdutoSearch] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(produtos[0]);
  const { toast } = useToast();
  const [isFinalizarModalOpen, setIsFinalizarModalOpen] = useState(false);

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

  const removerDoCarrinho = (produtoId: number) => {
    setCarrinho(carrinho.filter(item => item.produto.id !== produtoId));
  };

  const atualizarQuantidade = (produtoId: number, novaQuantidade: number) => {
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

  const confirmarFinalizacao = () => {
    toast({
      title: "Venda Finalizada",
      description: `Venda realizada com sucesso! Total: R$ ${subtotal.toFixed(2)}`,
    });
    
    setCarrinho([]);
    setClienteSearch("");
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
          />
        </div>
      </div>

      <FinalizarVendaModal
        isOpen={isFinalizarModalOpen}
        onClose={() => setIsFinalizarModalOpen(false)}
        onConfirm={confirmarFinalizacao}
        subtotal={subtotal}
      />
    </div>
  );
};

export default Vendas;
