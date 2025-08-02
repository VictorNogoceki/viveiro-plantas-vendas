import { supabase } from '@/integrations/supabase/client';
import { createFluxoCaixaFromVenda } from './fluxoCaixaService';
import { ItemCarrinho } from '@/types/carrinho';

export interface VendaCompleta {
  id: string;
  valor_total: number;
  data_venda: string;
  cliente_id?: string;
  tipo_pagamento?: string;
  observacoes?: string;
}

export const createVendaCompleta = async (
  carrinho: ItemCarrinho[],
  valorTotal: number,
  formasPagamento: { nome: string; valor: number }[],
  clienteId?: string
): Promise<string> => {
  try {
    // Criar a venda
    const { data: venda, error: vendaError } = await supabase
      .from('vendas')
      .insert([{
        valor_total: valorTotal,
        cliente_id: clienteId || null,
        tipo_pagamento: formasPagamento.map(f => f.nome).join(', '),
        observacoes: `Venda realizada com ${formasPagamento.length} forma(s) de pagamento`
      }])
      .select()
      .single();

    if (vendaError) {
      console.error('Erro ao criar venda:', vendaError);
      throw new Error('Não foi possível criar a venda.');
    }

    // Criar os itens da venda
    const itensVenda = carrinho.map(item => ({
      venda_id: venda.id,
      produto_id: item.produto.id,
      quantidade: item.quantidade,
      preco_unitario: item.produto.preco,
      subtotal: item.total
    }));

    const { error: itensError } = await supabase
      .from('itens_venda')
      .insert(itensVenda);

    if (itensError) {
      console.error('Erro ao criar itens da venda:', itensError);
      throw new Error('Não foi possível criar os itens da venda.');
    }

    // Criar registros no fluxo de caixa
    await createFluxoCaixaFromVenda(venda.id, valorTotal, formasPagamento);

    return venda.id;
  } catch (error) {
    console.error('Erro ao processar venda completa:', error);
    throw error;
  }
};