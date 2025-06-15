
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/ProductForm";
import { useProductForm } from "@/hooks/useProductForm";
import { Produto } from "@/types/produto";

interface EditProductDialogProps {
  produto: Produto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (produto: Produto) => void;
}

const EditProductDialog = ({ produto, open, onOpenChange, onSave }: EditProductDialogProps) => {
  const formLogic = useProductForm({
    initialProduct: produto,
    onSave: onSave as (p: Produto | Omit<Produto, 'id' | 'created_at'>) => void,
    onOpenChange,
  });

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Faça as alterações no seu produto e clique em 'Atualizar Produto' quando terminar.
          </DialogDescription>
        </DialogHeader>

        <ProductForm {...formLogic} />

        <div className="flex justify-start pt-4">
          <Button 
            onClick={formLogic.handleSave}
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

