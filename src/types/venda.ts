
export interface Venda {
  id: string;
  data_venda: string;
  valor_total: number;
  clientes: {
    nome: string;
  } | null;
}
