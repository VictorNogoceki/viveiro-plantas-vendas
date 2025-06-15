
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Cliente {
  id: number;
  nome: string;
  cpfCnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  tipo: 'cpf' | 'cnpj';
}

interface EditClientModalProps {
  cliente: Cliente | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (cliente: Cliente) => void;
}

const EditClientModal = ({ cliente, open, onOpenChange, onSave }: EditClientModalProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    cep: '',
    cidade: '',
    uf: '',
    endereco: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome,
        cpf: cliente.cpfCnpj,
        telefone: cliente.telefone,
        email: cliente.email,
        cep: '',
        cidade: '',
        uf: '',
        endereco: cliente.endereco
      });
    }
  }, [cliente]);

  const handleSave = () => {
    if (!cliente) return;

    if (!formData.nome || !formData.cpf || !formData.telefone) {
      toast({
        title: "Erro",
        description: "Por favor, preencha os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const updatedClient: Cliente = {
      ...cliente,
      nome: formData.nome,
      cpfCnpj: formData.cpf,
      telefone: formData.telefone,
      email: formData.email,
      endereco: formData.endereco
    };

    onSave(updatedClient);
    onOpenChange(false);
    
    toast({
      title: "Cliente Atualizado",
      description: `${formData.nome} foi atualizado com sucesso!`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Faça as alterações nos dados do cliente aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium">
              <span className="text-red-500">*</span> Nome
            </Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Nome completo"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-sm font-medium">
                <span className="text-red-500">*</span> CPF
              </Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                placeholder="Ex: 123.456.789-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-sm font-medium">
                <span className="text-red-500">*</span> Telefone
              </Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="Telefone"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cep" className="text-sm font-medium">
                CEP
              </Label>
              <Input
                id="cep"
                value={formData.cep}
                onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                placeholder="Ex: 12345-678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade" className="text-sm font-medium">
                Cidade
              </Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                placeholder="Ex: SÃO PAULO"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uf" className="text-sm font-medium">
                UF
              </Label>
              <Select value={formData.uf} onValueChange={(value) => setFormData(prev => ({ ...prev, uf: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SP">SP</SelectItem>
                  <SelectItem value="RJ">RJ</SelectItem>
                  <SelectItem value="MG">MG</SelectItem>
                  <SelectItem value="RS">RS</SelectItem>
                  <SelectItem value="PR">PR</SelectItem>
                  <SelectItem value="SC">SC</SelectItem>
                  <SelectItem value="GO">GO</SelectItem>
                  <SelectItem value="DF">DF</SelectItem>
                  <SelectItem value="MT">MT</SelectItem>
                  <SelectItem value="MS">MS</SelectItem>
                  <SelectItem value="BA">BA</SelectItem>
                  <SelectItem value="SE">SE</SelectItem>
                  <SelectItem value="PE">PE</SelectItem>
                  <SelectItem value="AL">AL</SelectItem>
                  <SelectItem value="PB">PB</SelectItem>
                  <SelectItem value="RN">RN</SelectItem>
                  <SelectItem value="CE">CE</SelectItem>
                  <SelectItem value="PI">PI</SelectItem>
                  <SelectItem value="MA">MA</SelectItem>
                  <SelectItem value="PA">PA</SelectItem>
                  <SelectItem value="AP">AP</SelectItem>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="RR">RR</SelectItem>
                  <SelectItem value="AC">AC</SelectItem>
                  <SelectItem value="RO">RO</SelectItem>
                  <SelectItem value="TO">TO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco" className="text-sm font-medium">
              Endereço
            </Label>
            <Textarea
              id="endereco"
              value={formData.endereco}
              onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
              placeholder="Endereço completo"
              className="min-h-[80px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;
