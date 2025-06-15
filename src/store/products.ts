
import { create } from 'zustand';
import { Produto } from '@/types/produto';

const initialProdutos: Produto[] = [
  {
    id: 1,
    codigo: "PLT001",
    nome: "ROSA VERMELHA",
    categoria: "Flores",
    estoque: 25,
    preco: 15.90,
    imagem: "/lovable-uploads/f3ca6925-b6cb-459b-9eaa-422549153b2b.png",
    unidade: "UN"
  },
  {
    id: 2,
    codigo: "PLT002", 
    nome: "SAMAMBAIA",
    categoria: "Folhagem",
    estoque: 8,
    preco: 25.00,
    imagem: "/lovable-uploads/4b16ca18-e502-4020-96ef-096f7dbea63d.png",
    unidade: "UN"
  },
  {
    id: 3,
    codigo: "PLT003",
    nome: "SUCULENTA ECHEVERIA",
    categoria: "Suculentas",
    estoque: 45,
    preco: 12.50,
    imagem: "/lovable-uploads/76b52c52-e6fb-4664-beb4-5dfa62c8869d.png",
    unidade: "UN"
  },
  {
    id: 4,
    codigo: "PLT004",
    nome: "ORQUÍDEA PHALAENOPSIS",
    categoria: "Flores",
    estoque: 5,
    preco: 85.00,
    imagem: "/lovable-uploads/56fd79a4-cedc-4c8d-a9fe-624dffa1d655.png",
    unidade: "UN"
  }
];

type ProductFormValues = Omit<Produto, "id" | "unidade" | "imagem"> & { imagem?: string };

interface ProductState {
  produtos: Produto[];
  updateStock: (produtoId: number, newStock: number) => void;
  updateProduct: (updatedProduct: Produto) => void;
  createProduct: (newProductData: ProductFormValues) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  produtos: initialProdutos,
  updateStock: (produtoId, newStock) =>
    set((state) => ({
      produtos: state.produtos.map((p) =>
        p.id === produtoId ? { ...p, estoque: newStock } : p
      ),
    })),
  updateProduct: (updatedProduct) =>
    set((state) => ({
      produtos: state.produtos.map((produto) =>
        produto.id === updatedProduct.id ? updatedProduct : produto
      ),
    })),
  createProduct: (newProductData) =>
    set((state) => {
      const newProduct: Produto = {
        ...newProductData,
        id: Math.max(...state.produtos.map(p => p.id), 0) + 1,
        imagem: newProductData.imagem || "/placeholder.svg",
        unidade: "UN",
      };
      return { produtos: [...state.produtos, newProduct] };
    }),
}));
