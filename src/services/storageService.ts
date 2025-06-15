
import { supabase } from '@/integrations/supabase/client';

export const uploadProdutoImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('produtos')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Erro no upload da imagem:', uploadError);
        throw new Error('Não foi possível fazer o upload da imagem.');
    }

    const { data } = supabase.storage
        .from('produtos')
        .getPublicUrl(filePath);

    if (!data.publicUrl) {
         throw new Error('Não foi possível obter a URL pública da imagem.');
    }
    
    return data.publicUrl;
};
