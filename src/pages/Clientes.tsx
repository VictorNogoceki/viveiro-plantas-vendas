
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, UserPlus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import EditClientModal from "@/components/EditClientModal";
import NovoClienteModal from "@/components/NovoClienteModal";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchClientes, addCliente, updateCliente, deleteCliente, Cliente, NewCliente } from "@/services/clientesService";


const Clientes = () => {
  const queryClient = useQueryClient();
  const { data: clientes = [], isLoading, isError, error } = useQuery<Cliente[], Error>({
    queryKey: ['clientes'],
    queryFn: fetchClientes,
  });

  const [showNovoClienteModal, setShowNovoClienteModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const { toast } = useToast();

  const addClientMutation = useMutation({
    mutationFn: addCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast({
        title: "Sucesso",
        description: "Cliente cadastrado com sucesso!",
      });
      setShowNovoClienteModal(false);
    },
    onError: (err: Error) => {
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const editClientMutation = useMutation({
    mutationFn: updateCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso!",
      });
      setShowEditModal(false);
    },
    onError: (err: Error) => {
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: deleteCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast({
        title: "Cliente Excluído",
        description: "Cliente excluído com sucesso!",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleAddClient = (clienteData: NewCliente) => {
    addClientMutation.mutate(clienteData);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingClient(cliente);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedClient: Cliente) => {
    editClientMutation.mutate(updatedClient);
  };

  const handleDelete = (clienteId: string) => {
    deleteClientMutation.mutate(clienteId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Cadastro de Clientes</h1>
        <Button onClick={() => setShowNovoClienteModal(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Clientes ({clientes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isError && <p className="text-red-500">Erro ao carregar clientes: {error.message}</p>}
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
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-[88px]" /></TableCell>
                  </TableRow>
                ))
              ) : (
                clientes.map((cliente) => (
                  <TableRow
                    key={cliente.id}
                    onClick={() => setSelectedClientId(selectedClientId === cliente.id ? null : cliente.id)}
                    className="cursor-pointer animate-fade-in data-[state=selected]:bg-green-100"
                    data-state={selectedClientId === cliente.id ? "selected" : undefined}
                  >
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(cliente)
                          }}
                          className="h-8 w-8"
                          disabled={editClientMutation.isPending}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                              onClick={(e) => e.stopPropagation()}
                              disabled={deleteClientMutation.isPending}
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditClientModal
        cliente={editingClient}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSave={handleSaveEdit}
        isSaving={editClientMutation.isPending}
      />
      <NovoClienteModal 
        open={showNovoClienteModal}
        onOpenChange={setShowNovoClienteModal}
        onClientAdded={handleAddClient}
        isAdding={addClientMutation.isPending}
      />
    </div>
  );
};

export default Clientes;
