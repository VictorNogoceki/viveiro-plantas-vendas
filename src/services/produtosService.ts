
import { supabase } from '@/integrations/supabase/client';
import { Produto } from '@/types/produto';

export type NewProduto = Omit<Produto, 'id' | 'created_at'>;

export const getProdutos = async (): Promise<Produto[]> => {
  const { data, error } = await supabase.from('produtos').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar produtos:', error);
    throw new Error('Não foi possível buscar os produtos.');
  }

  return data as Produto[];
};

export const createProduto = async (produtoData: Omit<Produto, 'id' | 'unidade' | 'imagem' | 'created_at'> & { imagem?: string }): Promise<Produto> => {
    const newProduct: NewProduto = {
        ...produtoData,
        imagem: produtoData.imagem || "/placeholder.svg",
        unidade: "UN",
    };

    const { data, error } = await supabase
        .from('produtos')
        .insert(newProduct)
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar produto:', error);
        throw new Error('Não foi possível criar o produto.');
    }

    return data as Produto;
};

export const updateProduto = async (produtoData: Produto): Promise<Produto> => {
    const { data, error } = await supabase
        .from('produtos')
        .update(produtoData)
        .eq('id', produtoData.id)
        .select()
        .single();
    
    if (error) {
        console.error('Erro ao atualizar produto:', error);
        throw new Error('Não foi possível atualizar o produto.');
    }

    return data as Produto;
};

export const deleteProduto = async (id: string): Promise<void> => {
  const { error } = await supabase.from('produtos').delete().eq('id', id);

  if (error) {
    console.error('Erro ao deletar produto:', error);
    throw new Error('Não foi possível deletar o produto.');
  }
};
