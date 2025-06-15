import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, Leaf, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import EditClientModal from "@/components/EditClientModal";
import NovoClienteModal from "@/components/NovoClienteModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Cliente {
  id: number;
  nome: string;
  cpfCnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  tipo: 'cpf' | 'cnpj';
}

interface ClienteData {
  nome: string;
  cpfCnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  tipo: 'cpf' | 'cnpj';
}

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: 1,
      nome: "Maria Silva",
      cpfCnpj: "123.456.789-00",
      endereco: "Rua das Flores, 123",
      telefone: "(11) 99999-9999",
      email: "maria@email.com",
      tipo: 'cpf'
    }
  ]);
  
  const [showNovoClienteModal, setShowNovoClienteModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const { toast } = useToast();

  const handleAddClient = (clienteData: ClienteData) => {
    const novoCliente: Cliente = {
      id: clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1,
      ...clienteData
    };

    setClientes([...clientes, novoCliente]);

    toast({
      title: "Sucesso",
      description: "Cliente cadastrado com sucesso!",
    });
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingClient(cliente);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedClient: Cliente) => {
    setClientes(clientes.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleDelete = (clienteId: number) => {
    const clienteToDelete = clientes.find(c => c.id === clienteId);
    setClientes(clientes.filter(c => c.id !== clienteId));
    
    toast({
      title: "Cliente Excluído",
      description: `${clienteToDelete?.nome} foi excluído com sucesso!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Leaf className="h-8 w-8 text-green-600" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Cadastro de Clientes</h1>
            </div>
            <Button onClick={() => setShowNovoClienteModal(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Novo Cliente
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Clientes ({clientes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead className="w-[120px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell>{cliente.cpfCnpj}</TableCell>
                    <TableCell>{cliente.telefone}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.endereco}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(cliente)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o cliente "{cliente.nome}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(cliente.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <EditClientModal
          cliente={editingClient}
          open={showEditModal}
          onOpenChange={setShowEditModal}
          onSave={handleSaveEdit}
        />
        <NovoClienteModal 
          open={showNovoClienteModal}
          onOpenChange={setShowNovoClienteModal}
          onClientAdded={handleAddClient}
        />
      </main>
    </div>
  );
};

export default Clientes;
