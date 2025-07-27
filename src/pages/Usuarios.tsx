
import { useState, useEffect } from "react";
import { Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserTable } from "@/components/usuarios/UserTable";
import { NovoUsuarioModal } from "@/components/usuarios/NovoUsuarioModal";
import { EditUsuarioModal } from "@/components/usuarios/EditUsuarioModal";
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

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoUsuarioOpen, setNovoUsuarioOpen] = useState(false);
  const [editUsuarioOpen, setEditUsuarioOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const { toast } = useToast();

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      
      // Buscar usuários
      const { data: usuariosData, error: usuariosError } = await supabase
        .from('usuarios')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (usuariosError) throw usuariosError;

      // Buscar permissões
      const { data: permissoesData, error: permissoesError } = await supabase
        .from('usuario_permissoes')
        .select('usuario_id, permissao');

      if (permissoesError) throw permissoesError;

      // Combinar dados
      const usuariosComPermissoes = usuariosData?.map(usuario => ({
        ...usuario,
        permissoes: permissoesData
          ?.filter(p => p.usuario_id === usuario.id)
          .map(p => p.permissao) || []
      })) || [];

      setUsuarios(usuariosComPermissoes);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleEditUsuario = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setEditUsuarioOpen(true);
  };

  const handleDeleteUsuario = async (id: string) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      });

      fetchUsuarios();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir usuário",
        variant: "destructive",
      });
    }
  };

  const handleUsuarioSalvo = () => {
    fetchUsuarios();
    setNovoUsuarioOpen(false);
    setEditUsuarioOpen(false);
    setUsuarioSelecionado(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4">
          Dashboard / Usuários
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-8 w-8" />
              Usuários
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerenciamento de Usuários
            </p>
          </div>
          <Button 
            onClick={() => setNovoUsuarioOpen(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {/* Tabela de usuários */}
        <UserTable
          usuarios={usuarios}
          loading={loading}
          onEdit={handleEditUsuario}
          onDelete={handleDeleteUsuario}
        />
      </div>

      {/* Modals */}
      <NovoUsuarioModal
        isOpen={novoUsuarioOpen}
        onClose={() => setNovoUsuarioOpen(false)}
        onUsuarioSalvo={handleUsuarioSalvo}
      />

      <EditUsuarioModal
        isOpen={editUsuarioOpen}
        onClose={() => {
          setEditUsuarioOpen(false);
          setUsuarioSelecionado(null);
        }}
        usuario={usuarioSelecionado}
        onUsuarioSalvo={handleUsuarioSalvo}
      />
    </div>
  );
};

export default Usuarios;
