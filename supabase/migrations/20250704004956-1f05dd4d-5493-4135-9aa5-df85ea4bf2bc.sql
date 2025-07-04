
-- Criar tabela de usuários
CREATE TABLE public.usuarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar enum para tipos de permissões
CREATE TYPE public.tipo_permissao AS ENUM ('usuario', 'administrador', 'gerente');

-- Criar tabela de permissões de usuários
CREATE TABLE public.usuario_permissoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  permissao public.tipo_permissao NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, permissao)
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario_permissoes ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para acesso público (temporário para desenvolvimento)
CREATE POLICY "Allow public access for usuarios" 
  ON public.usuarios 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow public access for usuario_permissoes" 
  ON public.usuario_permissoes 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Inserir dados de exemplo
INSERT INTO public.usuarios (nome, email, telefone, data_criacao) VALUES
('victor augusto', 'vansousa2006@gmail.com', NULL, '2025-06-10 00:00:00+00'),
('UserU', 'laxopa3043@pngzero.com', NULL, '2025-06-09 00:00:00+00'),
('UserG', 'telif18414@linacit.com', NULL, '2025-06-09 00:00:00+00'),
('LAZARO SOUZA', 'lmsinfo@gmail.com', NULL, '2025-06-09 00:00:00+00');

-- Inserir permissões de exemplo
INSERT INTO public.usuario_permissoes (usuario_id, permissao) 
SELECT u.id, 'usuario' FROM public.usuarios u WHERE u.email = 'vansousa2006@gmail.com';

INSERT INTO public.usuario_permissoes (usuario_id, permissao) 
SELECT u.id, 'administrador' FROM public.usuarios u WHERE u.email = 'vansousa2006@gmail.com';

INSERT INTO public.usuario_permissoes (usuario_id, permissao) 
SELECT u.id, 'usuario' FROM public.usuarios u WHERE u.email = 'laxopa3043@pngzero.com';

INSERT INTO public.usuario_permissoes (usuario_id, permissao) 
SELECT u.id, 'gerente' FROM public.usuarios u WHERE u.email = 'telif18414@linacit.com';

INSERT INTO public.usuario_permissoes (usuario_id, permissao) 
SELECT u.id, 'administrador' FROM public.usuarios u WHERE u.email = 'lmsinfo@gmail.com';
