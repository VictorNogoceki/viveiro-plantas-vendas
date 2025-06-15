
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { validateImageFile } from "@/lib/validation";
import { logSecurityEvent } from "@/lib/security";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const productSchema = z.object({
  codigo: z.string().min(1, "Código é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  estoque: z.coerce.number().min(0, "Estoque não pode ser negativo"),
  preco: z.coerce.number().min(0, "Preço não pode ser negativo"),
  unidade: z.string().default("UN"),
  imagem: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface NovoProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ProductFormValues) => void;
}

const NovoProductDialog = ({ open, onOpenChange, onSave }: NovoProductDialogProps) => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      codigo: "",
      nome: "",
      categoria: "",
      estoque: 0,
      preco: 0,
      unidade: "UN",
      imagem: "",
    },
  });
  const { toast } = useToast();

  const onSubmit = (data: ProductFormValues) => {
    onSave(data);
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

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
    form.setValue("imagem", imageUrl, { shouldValidate: true });
  };

  const imageUrl = form.watch("imagem");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para cadastrar um novo produto.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="PLT005" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                    <Input placeholder="Girassol" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Flores" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="estoque"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="unidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UN">Unidade (UN)</SelectItem>
                      <SelectItem value="KG">Quilograma (KG)</SelectItem>
                      <SelectItem value="LT">Litro (LT)</SelectItem>
                      <SelectItem value="MT">Metro (MT)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Label>Imagem do Produto</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload-novo')?.click()}
                >
                  Escolher arquivo
                </Button>
                {!imageUrl && <span className="text-sm text-gray-500">Nenhum arquivo escolhido</span>}
                <Input
                  id="image-upload-novo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              {imageUrl && (
                <div className="mt-4 relative w-32 h-32">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => form.setValue("imagem", "", { shouldValidate: true })}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NovoProductDialog;
