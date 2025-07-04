
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  data_criacao: string;
  ativo: boolean;
  permissoes: string[];
}

interface EditUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario | null;
  onUsuarioSalvo: () => void;
}

export const EditUsuarioModal = ({ isOpen, onClose, usuario, onUsuarioSalvo }: EditUsuarioModalProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    permissoes: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone || "",
        permissoes: usuario.permissoes,
      });
    }
  }, [usuario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
    
    setLoading(true);

    try {
      // Atualizar usuário
      const { error: usuarioError } = await supabase
        .from('usuarios')
        .update({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone || null,
        })
        .eq('id', usuario.id);

      if (usuarioError) throw usuarioError;

      // Remover permissões existentes
      const { error: deleteError } = await supabase
        .from('usuario_permissoes')
        .delete()
        .eq('usuario_id', usuario.id);

      if (deleteError) throw deleteError;

      // Inserir novas permissões
      if (formData.permissoes.length > 0) {
        const permissoesData = formData.permissoes.map(permissao => ({
          usuario_id: usuario.id,
          permissao: permissao,
        }));

        const { error: permissoesError } = await supabase
          .from('usuario_permissoes')
          .insert(permissoesData);

        if (permissoesError) throw permissoesError;
      }

      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso",
      });

      onUsuarioSalvo();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar usuário",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePermissaoChange = (permissao: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permissoes: [...prev.permissoes, permissao]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissoes: prev.permissoes.filter(p => p !== permissao)
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
            />
          </div>

          <div>
            <Label>Permissões</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="usuario-edit"
                  checked={formData.permissoes.includes('usuario')}
                  onCheckedChange={(checked) => handlePermissaoChange('usuario', checked as boolean)}
                />
                <Label htmlFor="usuario-edit">Usuário</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gerente-edit"
                  checked={formData.permissoes.includes('gerente')}
                  onCheckedChange={(checked) => handlePermissaoChange('gerente', checked as boolean)}
                />
                <Label htmlFor="gerente-edit">Gerente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="administrador-edit"
                  checked={formData.permissoes.includes('administrador')}
                  onCheckedChange={(checked) => handlePermissaoChange('administrador', checked as boolean)}
                />
                <Label htmlFor="administrador-edit">Administrador</Label>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-orange-500 hover:bg-orange-600">
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
