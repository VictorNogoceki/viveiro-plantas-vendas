import { supabase } from '@/integrations/supabase/client';

export interface FluxoCaixaRegistro {
  id?: string;
  data?: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  descricao: string;
  origem?: string;
}

export const getFluxoCaixa = async (): Promise<FluxoCaixaRegistro[]> => {
  const { data, error } = await supabase
    .from('fluxo_caixa')
    .select('*')
    .order('data', { ascending: false });

  if (error) {
    console.error('Erro ao buscar fluxo de caixa:', error);
    throw new Error('Não foi possível buscar os registros de fluxo de caixa.');
  }

  return (data || []).map(item => ({
    ...item,
    tipo: item.tipo as 'entrada' | 'saida'
  }));
};

export const createFluxoCaixaRegistro = async (registro: FluxoCaixaRegistro): Promise<void> => {
  const { error } = await supabase
    .from('fluxo_caixa')
    .insert([registro]);

  if (error) {
    console.error('Erro ao criar registro de fluxo de caixa:', error);
    throw new Error('Não foi possível criar o registro de fluxo de caixa.');
  }
};

export const createFluxoCaixaFromVenda = async (
  vendaId: string,
  valorTotal: number,
  formasPagamento: { nome: string; valor: number }[]
): Promise<void> => {
  const registros: FluxoCaixaRegistro[] = [];

  // Criar entradas para cada forma de pagamento
  formasPagamento.forEach(forma => {
    if (forma.valor > 0) {
      registros.push({
        valor: forma.valor,
        tipo: 'entrada',
        descricao: `Entrada em ${forma.nome.toLowerCase()} da venda #${vendaId}`,
        origem: 'venda'
      });
    }
  });

  // Criar saída para troco se houver
  const totalPago = formasPagamento.reduce((sum, forma) => sum + forma.valor, 0);
  const troco = totalPago - valorTotal;
  
  if (troco > 0) {
    registros.push({
      valor: troco,
      tipo: 'saida',
      descricao: `Troco em dinheiro da venda #${vendaId}`,
      origem: 'venda'
    });
  }

  // Inserir todos os registros
  if (registros.length > 0) {
    const { error } = await supabase
      .from('fluxo_caixa')
      .insert(registros);

    if (error) {
      console.error('Erro ao criar registros de fluxo de caixa da venda:', error);
      throw new Error('Não foi possível registrar a venda no fluxo de caixa.');
    }
  }
};

export const deleteFluxoCaixaRegistro = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('fluxo_caixa')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar registro de fluxo de caixa:', error);
    throw new Error('Não foi possível deletar o registro de fluxo de caixa.');
  }
};