
-- Cria a tabela para armazenar os produtos
CREATE TABLE public.produtos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  codigo text,
  nome text NOT NULL,
  categoria text,
  estoque integer NOT NULL DEFAULT 0,
  preco numeric NOT NULL DEFAULT 0,
  imagem text,
  unidade text
);

-- Habilita Row Level Security (RLS) para a tabela
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

-- Permite acesso público para leitura, inserção, atualização e exclusão.
-- Assim como na tabela de clientes, para um app real com múltiplos usuários,
-- você precisaria de regras mais restritas.
CREATE POLICY "Allow public access" ON public.produtos FOR ALL USING (true) WITH CHECK (true);

-- Insere os produtos iniciais que estavam no código
INSERT INTO public.produtos (codigo, nome, categoria, estoque, preco, imagem, unidade) VALUES
('PLT001', 'ROSA VERMELHA', 'Flores', 25, 15.90, '/lovable-uploads/f3ca6925-b6cb-459b-9eaa-422549153b2b.png', 'UN'),
('PLT002', 'SAMAMBAIA', 'Folhagem', 8, 25.00, '/lovable-uploads/4b16ca18-e502-4020-96ef-096f7dbea63d.png', 'UN'),
('PLT003', 'SUCULENTA ECHEVERIA', 'Suculentas', 45, 12.50, '/lovable-uploads/76b52c52-e6fb-4664-beb4-5dfa62c8869d.png', 'UN'),
('PLT004', 'ORQUÍDEA PHALAENOPSIS', 'Flores', 5, 85.00, '/lovable-uploads/56fd79a4-cedc-4c8d-a9fe-624dffa1d655.png', 'UN');

