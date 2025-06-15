
export interface MovimentacaoItem {
  id: string;
  data: string;
  tipo: "entrada" | "saida";
  produto: string;
  quantidade: number;
  usuario: string;
  observacao?: string;
}
