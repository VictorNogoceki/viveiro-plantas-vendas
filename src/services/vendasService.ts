
import { supabase } from '@/integrations/supabase/client';
import { Venda } from '@/types/venda';

export const getVendasSemNotaFiscal = async (): Promise<Venda[]> => {
  const { data: vendas, error: vendasError } = await supabase
    .from('vendas')
    .select(`
      id,
      data_venda,
      valor_total,
      clientes ( nome )
    `)
    .order('data_venda', { ascending: false });

  if (vendasError) {
    console.error(vendasError);
    throw new Error('Não foi possível buscar as vendas.');
  }

  const { data: notas, error: notasError } = await supabase
    .from('notas_fiscais')
    .select('venda_id');
  
  if (notasError) {
    console.error(notasError);
    throw new Error('Não foi possível verificar as notas fiscais existentes.');
  }

  const vendasComNotaIds = new Set(notas.map(n => n.venda_id));
  
  const vendasSemNota = vendas.filter(v => !vendasComNotaIds.has(v.id));

  return vendasSemNota;
};
