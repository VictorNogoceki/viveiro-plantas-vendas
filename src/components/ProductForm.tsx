
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Loader2 } from "lucide-react";

interface ProductFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors: Record<string, string>;
  handleInputChange: (field: string, value: string) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading?: boolean;
}

export const ProductForm = ({
  formData,
  setFormData,
  errors,
  handleInputChange,
  handleImageUpload,
  isUploading,
}: ProductFormProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="nome" className="text-sm font-medium text-red-500">
            * Nome do Produto
          </Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            placeholder="Nome do produto"
            maxLength={100}
            className={errors.nome ? "border-red-500" : ""}
          />
          {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="codigo" className="text-sm font-medium text-red-500">
            * Código
          </Label>
          <Input
            id="codigo"
            value={formData.codigo}
            onChange={(e) => handleInputChange('codigo', e.target.value)}
            placeholder="Código do produto"
            maxLength={20}
            className={errors.codigo ? "border-red-500" : ""}
          />
          {errors.codigo && <p className="text-sm text-red-500">{errors.codigo}</p>}
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="descricao" className="text-sm font-medium">
            Descrição
          </Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            placeholder="DESCRIÇÃO DO PRODUTO"
            className={`min-h-[100px] ${errors.descricao ? "border-red-500" : ""}`}
            maxLength={500}
          />
          {errors.descricao && <p className="text-sm text-red-500">{errors.descricao}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="preco" className="text-sm font-medium text-red-500">
            * Preço
          </Label>
          <Input
            id="preco"
            value={formData.preco}
            onChange={(e) => handleInputChange('preco', e.target.value)}
            placeholder="R$ 0,00"
            className={errors.preco ? "border-red-500" : ""}
          />
          {errors.preco && <p className="text-sm text-red-500">{errors.preco}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="estoque" className="text-sm font-medium text-red-500">
            * Estoque
          </Label>
          <Input
            id="estoque"
            value={formData.estoque}
            onChange={(e) => handleInputChange('estoque', e.target.value)}
            placeholder="Quantidade"
            className={errors.estoque ? "border-red-500" : ""}
          />
          {errors.estoque && <p className="text-sm text-red-500">{errors.estoque}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria" className="text-sm font-medium text-red-500">
            * Categoria
          </Label>
          <Input
            id="categoria"
            value={formData.categoria}
            onChange={(e) => handleInputChange('categoria', e.target.value)}
            placeholder="Categoria"
            maxLength={50}
            className={errors.categoria ? "border-red-500" : ""}
          />
          {errors.categoria && <p className="text-sm text-red-500">{errors.categoria}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unidade" className="text-sm font-medium text-red-500">
            * Unidade
          </Label>
          <Select value={formData.unidade} onValueChange={(value) => setFormData(prev => ({ ...prev, unidade: value }))}>
            <SelectTrigger className={errors.unidade ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecione a unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UN">Unidade (UN)</SelectItem>
              <SelectItem value="KG">Quilograma (KG)</SelectItem>
              <SelectItem value="LT">Litro (LT)</SelectItem>
              <SelectItem value="MT">Metro (MT)</SelectItem>
            </SelectContent>
          </Select>
          {errors.unidade && <p className="text-sm text-red-500">{errors.unidade}</p>}
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
                onClick={() => document.getElementById('image-upload-edit')?.click()}
                disabled={isUploading}
              >
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading ? 'Carregando...' : 'Escolher arquivo'}
              </Button>
              <span className="text-sm text-gray-500">Nenhum arquivo escolhido</span>
              <input
                id="image-upload-edit"
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
    </>
  );
};
