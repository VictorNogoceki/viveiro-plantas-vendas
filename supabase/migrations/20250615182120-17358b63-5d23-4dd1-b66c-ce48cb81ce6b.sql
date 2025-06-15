
-- Cria um "bucket" (um contêiner) no Supabase Storage para as imagens dos produtos.
-- Se o bucket 'produtos' já existir, nada será feito.
INSERT INTO storage.buckets (id, name, public)
VALUES ('produtos', 'produtos', true)
ON CONFLICT (id) DO NOTHING;

-- Apaga políticas de segurança antigas para o bucket 'produtos' para evitar conflitos.
DROP POLICY IF EXISTS "Public-read-access-for-produtos-bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public-insert-access-for-produtos-bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public-update-access-for-produtos-bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public-delete-access-for-produtos-bucket" ON storage.objects;

-- Cria novas políticas de segurança que permitem o acesso público para ver,
-- enviar, atualizar e deletar imagens no bucket 'produtos'.
-- Isso é necessário para que o formulário de produtos consiga gerenciar as imagens.

CREATE POLICY "Public-read-access-for-produtos-bucket"
ON storage.objects FOR SELECT
USING ( bucket_id = 'produtos' );

CREATE POLICY "Public-insert-access-for-produtos-bucket"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'produtos' );

CREATE POLICY "Public-update-access-for-produtos-bucket"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'produtos' );

CREATE POLICY "Public-delete-access-for-produtos-bucket"
ON storage.objects FOR DELETE
USING ( bucket_id = 'produtos' );
