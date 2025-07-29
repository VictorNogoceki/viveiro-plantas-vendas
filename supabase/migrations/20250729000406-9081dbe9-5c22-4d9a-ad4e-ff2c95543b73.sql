-- Atualizar códigos existentes para remover letras e manter apenas números
UPDATE produtos 
SET codigo_produto = REGEXP_REPLACE(codigo_produto, '[^0-9]', '', 'g')
WHERE codigo_produto IS NOT NULL 
AND codigo_produto != REGEXP_REPLACE(codigo_produto, '[^0-9]', '', 'g');