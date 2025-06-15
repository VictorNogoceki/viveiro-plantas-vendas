
import { Produto } from "@/types/produto";

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
  total: number;
}
