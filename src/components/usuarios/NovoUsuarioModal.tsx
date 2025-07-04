
import { useState } from "react";
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
import type { Database } from "@/integrations/supabase/types";

type TipoPermissao = Database["public"]["Enums"]["tipo_permissao"];

interface NovoUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUsuarioSalvo: () => void;
}

export const NovoUsuarioModal = ({ isOpen, onClose, onUsuarioSalvo }: NovoUsuarioModalProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    permissoes: [] as TipoPermissao[],
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Inserir usuário
      const { data: usuario, error: usuarioError } = await supabase
        .from('usuarios')
        .insert({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone || null,
        })
        .select()
        .single();

      if (usuarioError) throw usuarioError;

      // Inserir permissões
      if (formData.permissoes.length > 0) {
        const permissoesData = formData.permissoes.map(permissao => ({
          usuario_id: usuario.id,
          permissao: permissao as TipoPermissao,
        }));

        const { error: permissoesError } = await supabase
          .from('usuario_permissoes')
          .insert(permissoesData);

        if (permissoesError) throw permissoesError;
      }

      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso",
      });

      setFormData({
        nome: "",
        email: "",
        telefone: "",
        permissoes: [],
      });

      onUsuarioSalvo();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar usuário",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePermissaoChange = (permissao: TipoPermissao, checked: boolean) => {
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
          <DialogTitle>Novo Usuário</DialogTitle>
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
                  id="usuario"
                  checked={formData.permissoes.includes('usuario')}
                  onCheckedChange={(checked) => handlePermissaoChange('usuario', checked as boolean)}
                />
                <Label htmlFor="usuario">Usuário</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gerente"
                  checked={formData.permissoes.includes('gerente')}
                  onCheckedChange={(checked) => handlePermissaoChange('gerente', checked as boolean)}
                />
                <Label htmlFor="gerente">Gerente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="administrador"
                  checked={formData.permissoes.includes('administrador')}
                  onCheckedChange={(checked) => handlePermissaoChange('administrador', checked as boolean)}
                />
                <Label htmlFor="administrador">Administrador</Label>
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
