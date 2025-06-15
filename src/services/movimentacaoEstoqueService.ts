
import { supabase } from '@/integrations/supabase/client';
import { MovimentacaoItem } from '@/types/movimentacao';

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

