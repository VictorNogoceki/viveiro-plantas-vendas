
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Produto {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  estoque: number;
  preco: number;
  imagem: string;
}

interface EditProductDialogProps {
  produto: Produto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (produto: Produto) => void;
}

const EditProductDialog = ({ produto, open, onOpenChange, onSave }: EditProductDialogProps) => {
  const [formData, setFormData] = useState({
    nome: produto?.nome || "",
    codigo: produto?.codigo || "",
    descricao: "",
    preco: produto?.preco?.toString() || "",
    estoque: produto?.estoque?.toString() || "",
    unidade: "UN",
    categoria: produto?.categoria || "",
    ativo: true,
    imagem: produto?.imagem || ""
  });

  const { toast } = useToast();

  const handleSave = () => {
    if (!produto) return;

    const updatedProduct: Produto = {
      ...produto,
      nome: formData.nome,
      codigo: formData.codigo,
      categoria: formData.categoria,
      preco: parseFloat(formData.preco) || 0,
      estoque: parseInt(formData.estoque) || 0,
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
    if (file) {
      // Simular upload de imagem
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imagem: imageUrl }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Editar Produto
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium text-red-500">
              * Nome do Produto
            </Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Nome do produto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="codigo" className="text-sm font-medium text-red-500">
              * Código
            </Label>
            <Input
              id="codigo"
              value={formData.codigo}
              onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
              placeholder="Código do produto"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="descricao" className="text-sm font-medium">
              Descrição
            </Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="DESCRIÇÃO DO PRODUTO"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preco" className="text-sm font-medium text-red-500">
              * Preço
            </Label>
            <Input
              id="preco"
              value={formData.preco}
              onChange={(e) => setFormData(prev => ({ ...prev, preco: e.target.value }))}
              placeholder="R$ 0,00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estoque" className="text-sm font-medium text-red-500">
              * Estoque
            </Label>
            <Input
              id="estoque"
              value={formData.estoque}
              onChange={(e) => setFormData(prev => ({ ...prev, estoque: e.target.value }))}
              placeholder="Quantidade"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria" className="text-sm font-medium text-red-500">
              * Categoria
            </Label>
            <Input
              id="categoria"
              value={formData.categoria}
              onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
              placeholder="Categoria"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unidade" className="text-sm font-medium text-red-500">
              * Unidade
            </Label>
            <Select value={formData.unidade} onValueChange={(value) => setFormData(prev => ({ ...prev, unidade: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UN">Unidade (UN)</SelectItem>
                <SelectItem value="KG">Quilograma (KG)</SelectItem>
                <SelectItem value="LT">Litro (LT)</SelectItem>
                <SelectItem value="MT">Metro (MT)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="ativo" className="text-sm font-medium">
                Ativo
              </Label>
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Imagem do Produto
              </Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  Escolher arquivo
                </Button>
                <span className="text-sm text-gray-500">Nenhum arquivo escolhido</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              {formData.imagem && (
                <div className="mt-4 relative">
                  <img
                    src={formData.imagem}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setFormData(prev => ({ ...prev, imagem: "" }))}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-start pt-4">
          <Button 
            onClick={handleSave}
            className="bg-viveiro-green hover:bg-viveiro-green/90 text-white"
          >
            Atualizar Produto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
