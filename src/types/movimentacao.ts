
export interface MovimentacaoItem {
  id: number;
  data: string;
  tipo: "entrada" | "saida";
  produto: string;
  quantidade: number;
  usuario: string;
  observacao?: string;
}
