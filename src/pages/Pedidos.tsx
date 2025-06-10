
import { useState } from "react";
import { ClipboardList, Plus, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Pedido {
  id: number;
  nomeCliente: string;
  telefone: string;
  descricao: string;
  dataCreated: string;
  status: 'Pendente' | 'Em andamento' | 'Concluído';
}

const Pedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([
    {
      id: 1,
      nomeCliente: "João Silva",
      telefone: "(11) 98765-4321",
      descricao: "2 mudas de rosa vermelha, 1 vaso de violeta",
      dataCreated: "08/06/2025",
      status: 'Pendente'
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nomeCliente: '',
    telefone: '',
    descricao: ''
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nomeCliente || !formData.telefone || !formData.descricao) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const novoPedido: Pedido = {
      id: pedidos.length + 1,
      ...formData,
      dataCreated: new Date().toLocaleDateString('pt-BR'),
      status: 'Pendente'
    };

    setPedidos([...pedidos, novoPedido]);
    setFormData({
      nomeCliente: '',
      telefone: '',
      descricao: ''
    });
    setShowForm(false);

    toast({
      title: "Sucesso",
      description: "Pedido cadastrado com sucesso!",
    });
  };

  const updateStatus = (id: number, newStatus: 'Pendente' | 'Em andamento' | 'Concluído') => {
    setPedidos(pedidos.map(pedido => 
      pedido.id === id ? { ...pedido, status: newStatus } : pedido
    ));
    
    toast({
      title: "Status atualizado",
      description: `Pedido marcado como ${newStatus}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Pedidos</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Pedido
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Novo Pedido</CardTitle>
            <CardDescription>Preencha os dados do pedido</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nomeCliente">Nome do Cliente *</Label>
                  <Input
                    id="nomeCliente"
                    value={formData.nomeCliente}
                    onChange={(e) => setFormData({...formData, nomeCliente: e.target.value})}
                    placeholder="Digite o nome do cliente"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="descricao">Descrição do Pedido *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descreva os produtos e quantidades do pedido"
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Salvar Pedido</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Lista de Pedidos ({pedidos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Cliente</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell className="font-medium">{pedido.nomeCliente}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {pedido.telefone}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{pedido.descricao}</TableCell>
                  <TableCell>{pedido.dataCreated}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pedido.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                      pedido.status === 'Em andamento' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {pedido.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <select
                      value={pedido.status}
                      onChange={(e) => updateStatus(pedido.id, e.target.value as any)}
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Em andamento">Em andamento</option>
                      <option value="Concluído">Concluído</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pedidos;
