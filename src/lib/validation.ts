
import { z } from 'zod';

// Product validation schema
export const ProductSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-Z0-9\s\-À-ÿ]+$/, 'Nome contém caracteres inválidos'),
  codigo: z.string()
    .min(1, 'Código é obrigatório')
    .max(20, 'Código deve ter no máximo 20 caracteres')
    .regex(/^[A-Z0-9]+$/, 'Código deve conter apenas letras maiúsculas e números'),
  descricao: z.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
  preco: z.string()
    .refine((val) => !isNaN(Number(val.replace(',', '.'))), 'Preço deve ser um número válido')
    .refine((val) => Number(val.replace(',', '.')) > 0, 'Preço deve ser maior que zero')
    .refine((val) => Number(val.replace(',', '.')) <= 999999, 'Preço deve ser menor que R$ 999.999'),
  estoque: z.string()
    .refine((val) => !isNaN(Number(val)), 'Estoque deve ser um número válido')
    .refine((val) => Number(val) >= 0, 'Estoque não pode ser negativo')
    .refine((val) => Number(val) <= 999999, 'Estoque deve ser menor que 999.999'),
  categoria: z.string()
    .min(1, 'Categoria é obrigatória')
    .max(50, 'Categoria deve ter no máximo 50 caracteres')
    .regex(/^[a-zA-Z\s\-À-ÿ]+$/, 'Categoria contém caracteres inválidos'),
  unidade: z.enum(['UN', 'KG', 'LT', 'MT'], {
    errorMap: () => ({ message: 'Unidade inválida' })
  }),
  ativo: z.boolean()
});

// Client validation schema
export const ClientSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  email: z.string()
    .email('Email inválido')
    .max(100, 'Email deve ter no máximo 100 caracteres'),
  telefone: z.string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (XX) XXXXX-XXXX')
    .optional(),
  endereco: z.string()
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .optional()
});

// Cash flow validation schema
export const CashFlowSchema = z.object({
  tipoMovimentacao: z.enum(['entrada', 'saida'], {
    errorMap: () => ({ message: 'Tipo de movimentação inválido' })
  }),
  data: z.string()
    .refine((val) => !isNaN(Date.parse(val)), 'Data inválida'),
  descricao: z.string()
    .min(1, 'Descrição é obrigatória')
    .max(200, 'Descrição deve ter no máximo 200 caracteres'),
  valor: z.string()
    .refine((val) => !isNaN(Number(val.replace(',', '.'))), 'Valor deve ser um número válido')
    .refine((val) => Number(val.replace(',', '.')) > 0, 'Valor deve ser maior que zero')
    .refine((val) => Number(val.replace(',', '.')) <= 999999, 'Valor deve ser menor que R$ 999.999'),
  formaPagamento: z.enum(['Dinheiro', 'Crédito', 'Débito', 'PIX', 'Transferência', 'Cheque', '-'], {
    errorMap: () => ({ message: 'Forma de pagamento inválida' })
  }).optional()
});

// Stock movement validation schema
export const StockMovementSchema = z.object({
  produtoId: z.string()
    .min(1, 'Produto é obrigatório'),
  tipoMovimentacao: z.enum(['entrada', 'saida'], {
    errorMap: () => ({ message: 'Tipo de movimentação inválido' })
  }),
  quantidade: z.string()
    .refine((val) => !isNaN(Number(val)), 'Quantidade deve ser um número válido')
    .refine((val) => Number(val) > 0, 'Quantidade deve ser maior que zero')
    .refine((val) => Number(val) <= 999999, 'Quantidade deve ser menor que 999.999'),
  descricao: z.string()
    .min(1, 'Descrição é obrigatória')
    .max(200, 'Descrição deve ter no máximo 200 caracteres')
});

// Input sanitization utility
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// File validation utilities
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    return { isValid: false, error: 'Apenas arquivos JPEG, PNG, WebP e GIF são permitidos' };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'Arquivo deve ter no máximo 5MB' };
  }
  
  return { isValid: true };
};
