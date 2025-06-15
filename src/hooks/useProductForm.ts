
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProductSchema, sanitizeInput, validateImageFile } from "@/lib/validation";
import { logSecurityEvent } from "@/lib/security";
import { Produto } from "@/types/produto";

interface UseProductFormProps {
  initialProduct: Produto | null;
  onSave: (produto: Produto) => void;
  onOpenChange: (open: boolean) => void;
}

export const useProductForm = ({ initialProduct, onSave, onOpenChange }: UseProductFormProps) => {
  const [formData, setFormData] = useState({
    nome: initialProduct?.nome || "",
    codigo: initialProduct?.codigo || "",
    descricao: "",
    preco: initialProduct?.preco?.toString() || "",
    estoque: initialProduct?.estoque?.toString() || "",
    unidade: "UN",
    categoria: initialProduct?.categoria || "",
    ativo: true,
    imagem: initialProduct?.imagem || ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        nome: initialProduct.nome,
        codigo: initialProduct.codigo,
        descricao: "",
        preco: initialProduct.preco.toString(),
        estoque: initialProduct.estoque.toString(),
        unidade: "UN",
        categoria: initialProduct.categoria,
        ativo: true,
        imagem: initialProduct.imagem,
      });
      setErrors({});
    }
  }, [initialProduct]);

  const validateForm = (): boolean => {
    try {
      ProductSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      logSecurityEvent('Form validation failed', { errors: newErrors });
      return false;
    }
  };

  const handleSave = () => {
    if (!initialProduct || !validateForm()) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive"
      });
      return;
    }

    const updatedProduct: Produto = {
      ...initialProduct,
      nome: sanitizeInput(formData.nome),
      codigo: sanitizeInput(formData.codigo).toUpperCase(),
      categoria: sanitizeInput(formData.categoria),
      preco: parseFloat(formData.preco) || 0,
      estoque: parseInt(formData.estoque) || 0,
      imagem: formData.imagem,
    };

    onSave(updatedProduct);
    onOpenChange(false);
    
    toast({
      title: "Produto Atualizado",
      description: `${formData.nome} foi atualizado com sucesso!`,
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "Arquivo Inválido",
        description: validation.error,
        variant: "destructive"
      });
      logSecurityEvent('Invalid file upload attempt', { fileName: file.name, fileType: file.type, fileSize: file.size });
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, imagem: imageUrl }));
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return {
    formData,
    setFormData,
    errors,
    handleInputChange,
    handleImageUpload,
    handleSave,
  };
};
