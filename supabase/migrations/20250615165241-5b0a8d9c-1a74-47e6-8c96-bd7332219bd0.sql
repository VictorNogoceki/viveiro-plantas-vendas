
-- Cria a tabela para armazenar os clientes
CREATE TABLE public.clientes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nome text NOT NULL,
  cpf_cnpj text NOT NULL,
  endereco text,
  telefone text NOT NULL,
  email text,
  tipo text
);

-- Habilita Row Level Security (RLS) para a tabela
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Permite acesso público para leitura, inserção, atualização e exclusão.
-- ATENÇÃO: Isso permite que qualquer pessoa acesse os dados.
-- Para um aplicativo real, você deve implementar autenticação e
-- restringir o acesso apenas a usuários autorizados.
CREATE POLICY "Allow public access" ON public.clientes FOR ALL USING (true) WITH CHECK (true);

