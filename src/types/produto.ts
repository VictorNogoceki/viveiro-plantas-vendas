
export interface Produto {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  estoque: number;
  preco: number;
  imagem: string;
  unidade: string;
  created_at: string;
  descricao?: string;
  ativo?: boolean;
}
