import { supabase } from '@/integrations/supabase/client';
import { Produto, NewProduto } from '@/types/produto';

// Interface para o formato de dados vindo do banco (com colunas renomeadas)
interface ProdutoFromDB {
  id: string;
  created_at: string;
  nome: string;
  preco: number;
  unidade: string | null;
  categoria: string | null;
  codigo_produto: string | null;
  quantidade_estoque: number;
  imagem_url: string | null;
  descricao: string | null;
  ativo: boolean | null;
}

// Converte do formato do banco para o formato da aplicação
const fromDB = (p: ProdutoFromDB): Produto => ({
  id: p.id,
  created_at: p.created_at,
  nome: p.nome,
  preco: p.preco,
  unidade: p.unidade || 'UN',
  categoria: p.categoria || '',
  codigo: p.codigo_produto || '',
  estoque: p.quantidade_estoque || 0,
  imagem: p.imagem_url || '/placeholder.svg',
  descricao: p.descricao || '',
  ativo: p.ativo ?? true,
});

// Converte do formato da aplicação para o formato do banco
const toDB = (p: Partial<Produto>): Partial<ProdutoFromDB> => {
    const dbProduct: { [key: string]: any } = {};

    if (p.nome !== undefined) dbProduct.nome = p.nome;
    if (p.preco !== undefined) dbProduct.preco = p.preco;
    if (p.unidade !== undefined) dbProduct.unidade = p.unidade;
    if (p.categoria !== undefined) dbProduct.categoria = p.categoria;
    if (p.codigo !== undefined) dbProduct.codigo_produto = p.codigo;
    if (p.estoque !== undefined) dbProduct.quantidade_estoque = p.estoque;
    if (p.imagem !== undefined) dbProduct.imagem_url = p.imagem;
    if (p.descricao !== undefined) dbProduct.descricao = p.descricao;
    if (p.ativo !== undefined) dbProduct.ativo = p.ativo;

    return dbProduct;
};

export const getProdutos = async (): Promise<Produto[]> => {
  const { data, error } = await supabase.from('produtos').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar produtos:', error);
    throw new Error('Não foi possível buscar os produtos.');
  }

  const produtos = (data as ProdutoFromDB[]).map(fromDB);

  // Substitui a imagem do produto "alface" por um placeholder
  return produtos.map(p => {
    if (p.nome.toLowerCase() === 'alface') {
      return { ...p, imagem: 'https://images.pexels.com/photos/2893636/pexels-photo-2893636.jpeg' };
    }
    return p;
  });
};

export const createProduto = async (produtoData: NewProduto): Promise<Produto> => {
    // Manually construct the object to insert to avoid type issues with toDB
    const productToInsert = {
        nome: produtoData.nome,
        preco: produtoData.preco,
        unidade: produtoData.unidade,
        categoria: produtoData.categoria,
        codigo_produto: produtoData.codigo,
        quantidade_estoque: produtoData.estoque,
        imagem_url: produtoData.imagem,
        descricao: produtoData.descricao,
        ativo: produtoData.ativo,
    };

    const { data, error } = await supabase
        .from('produtos')
        .insert(productToInsert)
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar produto:', error.message);
        throw new Error('Não foi possível criar o produto.');
    }

    return fromDB(data as ProdutoFromDB);
};

export const updateProduto = async (produtoData: Produto): Promise<Produto> => {
    const { id, ...updateData } = produtoData;
    const { data, error } = await supabase
        .from('produtos')
        .update(toDB(updateData))
        .eq('id', id)
        .select()
        .single();
    
    if (error) {
        console.error('Erro ao atualizar produto:', error);
        throw new Error('Não foi possível atualizar o produto.');
    }

    return fromDB(data as ProdutoFromDB);
};

export const deleteProduto = async (id: string): Promise<void> => {
  const { error } = await supabase.from('produtos').delete().eq('id', id);

  if (error) {
    console.error('Erro ao deletar produto:', error);
    throw new Error('Não foi possível deletar o produto.');
  }
};
