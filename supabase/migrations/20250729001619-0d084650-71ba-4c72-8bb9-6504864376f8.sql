-- Função para criar usuário na tabela usuarios quando um novo usuário é criado no auth
CREATE OR REPLACE FUNCTION public.handle_new_user_to_usuarios()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.usuarios (nome, email, telefone, data_criacao)
  VALUES (
    COALESCE(new.raw_user_meta_data ->> 'nome', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'telefone',
    new.created_at
  );
  RETURN new;
END;
$$;

-- Trigger para executar a função quando um usuário é criado
CREATE OR REPLACE TRIGGER on_auth_user_created_usuarios
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_to_usuarios();

-- Inserir usuário existente que não foi criado automaticamente
INSERT INTO public.usuarios (nome, email, telefone, data_criacao)
SELECT 
  COALESCE(raw_user_meta_data ->> 'nome', split_part(email, '@', 1)) as nome,
  email,
  raw_user_meta_data ->> 'telefone' as telefone,
  created_at as data_criacao
FROM auth.users 
WHERE id NOT IN (SELECT DISTINCT usuario_id FROM usuario_permissoes WHERE usuario_id IS NOT NULL)
  AND email NOT IN (SELECT email FROM usuarios WHERE email IS NOT NULL);