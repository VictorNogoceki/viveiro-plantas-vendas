
import { supabase } from "@/integrations/supabase/client";

// Interface que representa o dado como ele vem do banco de dados (snake_case)
interface ClienteFromDB {
  id: string;
  created_at: string;
  nome: string;
  cpf_cnpj: string;
  endereco: string | null;
  telefone: string;
  email: string | null;
  tipo: string | null;
}

// Interface usada na aplicação (camelCase)
export interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  tipo: 'cpf' | 'cnpj';
}

// Tipo para criar um novo cliente, sem o 'id'
export type NewCliente = Omit<Cliente, 'id'>;

// Função para converter do formato do DB para o formato da aplicação
const fromDB = (cliente: ClienteFromDB): Cliente => ({
    id: cliente.id,
    nome: cliente.nome,
    cpfCnpj: cliente.cpf_cnpj,
    endereco: cliente.endereco || '',
    telefone: cliente.telefone,
    email: cliente.email || '',
    tipo: cliente.tipo === 'cnpj' ? 'cnpj' : 'cpf', // padrão para cpf
});

// Função para converter do formato da aplicação para o formato do DB
const toDB = (cliente: Partial<Cliente> | NewCliente) => ({
    nome: cliente.nome,
    cpf_cnpj: cliente.cpfCnpj,
    endereco: cliente.endereco,
    telefone: cliente.telefone,
    email: cliente.email,
    tipo: cliente.tipo,
});

export const fetchClientes = async (): Promise<Cliente[]> => {
    const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching clients:', error);
        throw new Error('Não foi possível buscar os clientes.');
    }

    return data ? data.map(fromDB) : [];
};

export const addCliente = async (cliente: NewCliente): Promise<Cliente> => {
    const { data, error } = await supabase
        .from('clientes')
        .insert(toDB(cliente))
        .select()
        .single();
    
    if (error) {
        console.error('Error adding client:', error);
        throw new Error('Não foi possível adicionar o cliente.');
    }

    return fromDB(data);
};

export const updateCliente = async (cliente: Cliente): Promise<Cliente> => {
    const { data, error } = await supabase
        .from('clientes')
        .update(toDB(cliente))
        .eq('id', cliente.id)
        .select()
        .single();
    
    if (error) {
        console.error('Error updating client:', error);
        throw new Error('Não foi possível atualizar o cliente.');
    }

    return fromDB(data);
};

export const deleteCliente = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting client:', error);
        throw new Error('Não foi possível excluir o cliente.');
    }
};
