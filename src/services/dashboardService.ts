import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalVendas: number;
  totalPedidos: number;
  totalClientes: number;
  totalProdutos: number;
  valorEstoque: number;
}

export interface VendaEvolution {
  data: string;
  vendas: number;
}

export interface ProdutoMaisVendido {
  produto: string;
  vendas: number;
}

export interface ClienteTop {
  nome: string;
  compras: string;
  pedidos: number;
}

export interface EstoqueBaixo {
  produto: string;
  estoque: number;
  minimo: number;
}

export interface UltimoPedido {
  id: string;
  cliente: string;
  valor: number;
  status: string;
  data: string;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  // Total de vendas este mês
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const { data: vendas } = await supabase
    .from('vendas')
    .select('valor_total')
    .gte('data_venda', inicioMes.toISOString());

  const totalVendas = vendas?.reduce((acc, venda) => acc + Number(venda.valor_total), 0) || 0;

  // Total de pedidos este mês
  const { count: totalPedidos } = await supabase
    .from('vendas')
    .select('*', { count: 'exact', head: true })
    .gte('data_venda', inicioMes.toISOString());

  // Total de clientes ativos
  const { count: totalClientes } = await supabase
    .from('clientes')
    .select('*', { count: 'exact', head: true });

  // Total de produtos e valor do estoque
  const { data: produtos } = await supabase
    .from('produtos')
    .select('quantidade_estoque, preco')
    .eq('ativo', true);

  const totalProdutos = produtos?.reduce((acc, produto) => acc + produto.quantidade_estoque, 0) || 0;
  const valorEstoque = produtos?.reduce((acc, produto) => 
    acc + (produto.quantidade_estoque * Number(produto.preco)), 0) || 0;

  return {
    totalVendas,
    totalPedidos: totalPedidos || 0,
    totalClientes: totalClientes || 0,
    totalProdutos,
    valorEstoque,
  };
};

export const getVendasEvolution = async (): Promise<VendaEvolution[]> => {
  const ultimosDias = new Date();
  ultimosDias.setDate(ultimosDias.getDate() - 7);

  const { data: vendas } = await supabase
    .from('vendas')
    .select('data_venda, valor_total')
    .gte('data_venda', ultimosDias.toISOString())
    .order('data_venda', { ascending: true });

  // Agrupa vendas por dia
  const vendasPorDia = vendas?.reduce((acc: Record<string, number>, venda) => {
    const data = new Date(venda.data_venda).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
    acc[data] = (acc[data] || 0) + Number(venda.valor_total);
    return acc;
  }, {}) || {};

  return Object.entries(vendasPorDia).map(([data, vendas]) => ({
    data,
    vendas,
  }));
};

export const getProdutosMaisVendidos = async (): Promise<ProdutoMaisVendido[]> => {
  const { data: itensVenda } = await supabase
    .from('itens_venda')
    .select(`
      quantidade,
      produtos!inner(nome)
    `)
    .limit(100);

  // Agrupa por produto
  const vendasPorProduto = itensVenda?.reduce((acc: Record<string, number>, item) => {
    const nomeProduto = (item.produtos as any)?.nome;
    if (nomeProduto) {
      acc[nomeProduto] = (acc[nomeProduto] || 0) + item.quantidade;
    }
    return acc;
  }, {}) || {};

  return Object.entries(vendasPorProduto)
    .map(([produto, vendas]) => ({ produto, vendas }))
    .sort((a, b) => b.vendas - a.vendas)
    .slice(0, 5);
};

export const getEstoqueBaixo = async (): Promise<EstoqueBaixo[]> => {
  const { data: produtos } = await supabase
    .from('produtos')
    .select('nome, quantidade_estoque')
    .eq('ativo', true)
    .lte('quantidade_estoque', 10)
    .order('quantidade_estoque', { ascending: true });

  return produtos?.map(produto => ({
    produto: produto.nome,
    estoque: produto.quantidade_estoque,
    minimo: 10, // Valor padrão para estoque mínimo
  })) || [];
};

export const getTopClientes = async (): Promise<ClienteTop[]> => {
  const { data: vendas } = await supabase
    .from('vendas')
    .select(`
      valor_total,
      clientes!inner(nome)
    `)
    .not('cliente_id', 'is', null);

  // Agrupa por cliente
  const vendasPorCliente = vendas?.reduce((acc: Record<string, {total: number, pedidos: number}>, venda) => {
    const nomeCliente = (venda.clientes as any)?.nome;
    if (nomeCliente) {
      if (!acc[nomeCliente]) {
        acc[nomeCliente] = { total: 0, pedidos: 0 };
      }
      acc[nomeCliente].total += Number(venda.valor_total);
      acc[nomeCliente].pedidos += 1;
    }
    return acc;
  }, {}) || {};

  return Object.entries(vendasPorCliente)
    .map(([nome, dados]) => ({
      nome,
      compras: `R$ ${dados.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      pedidos: dados.pedidos,
    }))
    .sort((a, b) => {
      const aTotal = parseFloat(a.compras.replace('R$ ', '').replace('.', '').replace(',', '.'));
      const bTotal = parseFloat(b.compras.replace('R$ ', '').replace('.', '').replace(',', '.'));
      return bTotal - aTotal;
    })
    .slice(0, 3);
};

export const getUltimosPedidos = async (): Promise<UltimoPedido[]> => {
  const { data: vendas } = await supabase
    .from('vendas')
    .select(`
      id,
      valor_total,
      data_venda,
      clientes(nome)
    `)
    .order('data_venda', { ascending: false })
    .limit(4);

  return vendas?.map(venda => ({
    id: venda.id.slice(0, 8),
    cliente: (venda.clientes as any)?.nome || 'Cliente não informado',
    valor: Number(venda.valor_total),
    status: 'Concluído', // Por simplicidade, consideramos todas como concluídas
    data: new Date(venda.data_venda).toLocaleDateString('pt-BR'),
  })) || [];
};