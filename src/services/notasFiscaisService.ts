
import { supabase } from '@/integrations/supabase/client';
import { NotaFiscal } from '@/types/notaFiscal';

export const getNotasFiscais = async (): Promise<NotaFiscal[]> => {
  const { data, error } = await supabase
    .from('notas_fiscais')
    .select(`
      id,
      numero_nf,
      status,
      data_emissao,
      vendas (
        valor_total,
        clientes ( nome )
      )
    `)
    .order('data_emissao', { ascending: false });

  if (error) {
    console.error('Erro ao buscar notas fiscais:', error);
    throw new Error('Não foi possível buscar as notas fiscais.');
  }

  if (!data) return [];

  return data.map((nf: any) => ({
    id: nf.id,
    numero: nf.numero_nf || `PENDENTE-${nf.id.slice(0, 4)}`,
    cliente: nf.vendas?.clientes?.nome || 'Cliente não informado',
    valor: nf.vendas?.valor_total || 0,
    data: nf.data_emissao ? new Date(nf.data_emissao).toLocaleDateString('pt-BR') : 'N/D',
    status: nf.status || 'Desconhecido',
  }));
};

export const createNotaFiscalFromVenda = async (vendaId: string) => {
  const { data: existing, error: checkError } = await supabase
    .from('notas_fiscais')
    .select('id')
    .eq('venda_id', vendaId)
    .limit(1);

  if (checkError) {
    throw new Error('Erro ao verificar nota fiscal existente.');
  }

  if (existing && existing.length > 0) {
    throw new Error('Já existe uma nota fiscal para esta venda.');
  }
  
  const { data, error } = await supabase
    .from('notas_fiscais')
    .insert({ venda_id: vendaId, status: 'Emitida' })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar nota fiscal:', error);
    throw new Error('Não foi possível criar a nota fiscal.');
  }

  return data;
};
