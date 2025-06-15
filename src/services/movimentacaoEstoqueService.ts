
import { supabase } from '@/integrations/supabase/client';
import { MovimentacaoItem, NewMovimentacao } from '@/types/movimentacao';

interface MovimentacaoFromDB {
  id: string;
  data: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  motivo: string | null;
  produtos: {
    nome: string;
  } | null;
}

const fromDB = (m: MovimentacaoFromDB): MovimentacaoItem => ({
  id: m.id,
  data: new Date(m.data).toLocaleString('pt-BR'),
  tipo: m.tipo,
  produto: m.produtos?.nome || 'Produto desconhecido',
  quantidade: m.quantidade,
  usuario: 'Sistema', // Placeholder
  observacao: m.motivo || '',
});

export const getMovimentacoes = async (): Promise<MovimentacaoItem[]> => {
  const { data, error } = await supabase
    .from('movimentacao_estoque')
    .select(`
      id,
      data,
      tipo,
      quantidade,
      motivo,
      produtos ( nome )
    `)
    .order('data', { ascending: false });

  if (error) {
    console.error('Erro ao buscar movimentações de estoque:', error);
    throw new Error('Não foi possível buscar as movimentações.');
  }

  return (data as any[]).map(fromDB);
};

export const createMovimentacao = async (movimentacao: NewMovimentacao) => {
  const { data, error } = await supabase
    .from('movimentacao_estoque')
    .insert({
      produto_id: movimentacao.produtoId,
      tipo: movimentacao.tipo,
      quantidade: movimentacao.quantidade,
      motivo: movimentacao.motivo,
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar movimentação de estoque:', error);
    if (error.message.includes('Estoque insuficiente')) {
        throw new Error('Estoque insuficiente para realizar a saída.');
    }
    throw new Error('Não foi possível registrar a movimentação.');
  }

  return data;
};
