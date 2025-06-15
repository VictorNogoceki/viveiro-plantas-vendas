
export interface EstoqueItem {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  estoque: number;
  unidade: string;
  status: "normal" | "baixo";
}

export interface MovimentacaoItem {
  id: number;
  data: string;
  tipo: "entrada" | "saida";
  produto: string;
  quantidade: number;
  usuario: string;
  observacao?: string;
}
