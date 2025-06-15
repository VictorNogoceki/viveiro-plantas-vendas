export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: {
          cpf_cnpj: string
          created_at: string
          data_cadastro: string | null
          email: string | null
          endereco: string | null
          id: string
          nome: string
          telefone: string
          tipo: string | null
        }
        Insert: {
          cpf_cnpj: string
          created_at?: string
          data_cadastro?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          telefone: string
          tipo?: string | null
        }
        Update: {
          cpf_cnpj?: string
          created_at?: string
          data_cadastro?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string
          tipo?: string | null
        }
        Relationships: []
      }
      fluxo_caixa: {
        Row: {
          data: string
          descricao: string
          id: string
          origem: string | null
          tipo: string
          valor: number
        }
        Insert: {
          data?: string
          descricao: string
          id?: string
          origem?: string | null
          tipo: string
          valor: number
        }
        Update: {
          data?: string
          descricao?: string
          id?: string
          origem?: string | null
          tipo?: string
          valor?: number
        }
        Relationships: []
      }
      itens_venda: {
        Row: {
          id: string
          preco_unitario: number
          produto_id: string
          quantidade: number
          subtotal: number
          venda_id: string
        }
        Insert: {
          id?: string
          preco_unitario: number
          produto_id: string
          quantidade: number
          subtotal: number
          venda_id: string
        }
        Update: {
          id?: string
          preco_unitario?: number
          produto_id?: string
          quantidade?: number
          subtotal?: number
          venda_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itens_venda_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_venda_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      movimentacao_estoque: {
        Row: {
          data: string
          id: string
          motivo: string | null
          produto_id: string
          quantidade: number
          tipo: string
        }
        Insert: {
          data?: string
          id?: string
          motivo?: string | null
          produto_id: string
          quantidade: number
          tipo: string
        }
        Update: {
          data?: string
          id?: string
          motivo?: string | null
          produto_id?: string
          quantidade?: number
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "movimentacao_estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      notas_fiscais: {
        Row: {
          chave_acesso: string | null
          data_emissao: string | null
          id: string
          numero_nf: string | null
          serie: string | null
          status: string | null
          venda_id: string
          xml_path: string | null
        }
        Insert: {
          chave_acesso?: string | null
          data_emissao?: string | null
          id?: string
          numero_nf?: string | null
          serie?: string | null
          status?: string | null
          venda_id: string
          xml_path?: string | null
        }
        Update: {
          chave_acesso?: string | null
          data_emissao?: string | null
          id?: string
          numero_nf?: string | null
          serie?: string | null
          status?: string | null
          venda_id?: string
          xml_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notas_fiscais_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean | null
          categoria: string | null
          codigo_produto: string | null
          created_at: string
          descricao: string | null
          id: string
          imagem_url: string | null
          nome: string
          preco: number
          quantidade_estoque: number
          unidade: string | null
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string | null
          codigo_produto?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          nome: string
          preco?: number
          quantidade_estoque?: number
          unidade?: string | null
        }
        Update: {
          ativo?: boolean | null
          categoria?: string | null
          codigo_produto?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          nome?: string
          preco?: number
          quantidade_estoque?: number
          unidade?: string | null
        }
        Relationships: []
      }
      vendas: {
        Row: {
          cliente_id: string | null
          data_venda: string
          id: string
          observacoes: string | null
          tipo_pagamento: string | null
          valor_total: number
        }
        Insert: {
          cliente_id?: string | null
          data_venda?: string
          id?: string
          observacoes?: string | null
          tipo_pagamento?: string | null
          valor_total: number
        }
        Update: {
          cliente_id?: string | null
          data_venda?: string
          id?: string
          observacoes?: string | null
          tipo_pagamento?: string | null
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "vendas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
