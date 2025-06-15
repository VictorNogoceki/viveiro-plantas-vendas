
-- Adiciona colunas e renomeia outras nas tabelas existentes para corresponder à sua estrutura

-- Altera a tabela 'clientes'
ALTER TABLE public.clientes ADD COLUMN data_cadastro timestamp with time zone DEFAULT now();

-- Altera a tabela 'produtos'
-- Renomeia colunas para consistência
ALTER TABLE public.produtos RENAME COLUMN codigo TO codigo_produto;
ALTER TABLE public.produtos RENAME COLUMN estoque TO quantidade_estoque;
ALTER TABLE public.produtos RENAME COLUMN imagem TO imagem_url;
-- Adiciona novas colunas
ALTER TABLE public.produtos ADD COLUMN descricao text;
ALTER TABLE public.produtos ADD COLUMN ativo boolean DEFAULT true;

-- Cria as novas tabelas

-- Tabela: movimentacao_estoque
CREATE TABLE public.movimentacao_estoque (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id uuid NOT NULL REFERENCES public.produtos(id),
  quantidade integer NOT NULL,
  tipo text NOT NULL,
  motivo text,
  data timestamp with time zone NOT NULL DEFAULT now()
);
COMMENT ON COLUMN public.movimentacao_estoque.tipo IS 'Valores possíveis: entrada, saida';
COMMENT ON COLUMN public.movimentacao_estoque.motivo IS 'Valores possíveis: venda, ajuste, compra';
ALTER TABLE public.movimentacao_estoque ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access for movimentacao_estoque" ON public.movimentacao_estoque FOR ALL USING (true) WITH CHECK (true);

-- Tabela: vendas
CREATE TABLE public.vendas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id uuid REFERENCES public.clientes(id),
  data_venda timestamp with time zone NOT NULL DEFAULT now(),
  valor_total numeric NOT NULL,
  tipo_pagamento text,
  observacoes text
);
ALTER TABLE public.vendas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access for vendas" ON public.vendas FOR ALL USING (true) WITH CHECK (true);

-- Tabela: itens_venda
CREATE TABLE public.itens_venda (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venda_id uuid NOT NULL REFERENCES public.vendas(id) ON DELETE CASCADE,
  produto_id uuid NOT NULL REFERENCES public.produtos(id),
  quantidade integer NOT NULL,
  preco_unitario numeric NOT NULL,
  subtotal numeric NOT NULL
);
ALTER TABLE public.itens_venda ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access for itens_venda" ON public.itens_venda FOR ALL USING (true) WITH CHECK (true);

-- Tabela: notas_fiscais
CREATE TABLE public.notas_fiscais (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venda_id uuid NOT NULL REFERENCES public.vendas(id) ON DELETE CASCADE,
  numero_nf text,
  serie text,
  chave_acesso text,
  xml_path text,
  status text,
  data_emissao timestamp with time zone DEFAULT now()
);
ALTER TABLE public.notas_fiscais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access for notas_fiscais" ON public.notas_fiscais FOR ALL USING (true) WITH CHECK (true);

-- Tabela: fluxo_caixa
CREATE TABLE public.fluxo_caixa (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data timestamp with time zone NOT NULL DEFAULT now(),
  tipo text NOT NULL,
  descricao text NOT NULL,
  valor numeric NOT NULL,
  origem text
);
COMMENT ON COLUMN public.fluxo_caixa.tipo IS 'Valores possíveis: entrada, saida';
COMMENT ON COLUMN public.fluxo_caixa.origem IS 'Valores possíveis: venda, pagamento, ajuste';
ALTER TABLE public.fluxo_caixa ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access for fluxo_caixa" ON public.fluxo_caixa FOR ALL USING (true) WITH CHECK (true);
