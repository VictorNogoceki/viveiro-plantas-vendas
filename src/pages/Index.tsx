
import { Leaf, Package, ShoppingCart, Users, DollarSign, Settings, BarChart3, AlertTriangle, Calendar, FileText, Zap, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Index = () => {
  const modulos = [
    {
      titulo: "Produtos e Estoque",
      descricao: "Gestão completa de produtos, estoque e fornecedores",
      icone: Package,
      cor: "bg-green-500",
      funcionalidades: [
        "Cadastro de produtos (nome comum, científico, categoria)",
        "Controle de estoque com entradas e saídas",
        "Alertas para estoque mínimo",
        "Histórico de movimentações",
        "Gestão de fornecedores"
      ],
      rota: "/produtos",
      status: "ativo"
    },
    {
      titulo: "Vendas",
      descricao: "PDV, orçamentos e relatórios de vendas",
      icone: ShoppingCart,
      cor: "bg-blue-500",
      funcionalidades: [
        "Registro de vendas com múltiplos produtos",
        "PDV com suporte a código de barras",
        "Geração de orçamentos",
        "Impressão de recibos",
        "Relatórios por período, produto e cliente"
      ],
      rota: "/vendas",
      status: "ativo"
    },
    {
      titulo: "Clientes",
      descricao: "Cadastro e relacionamento com clientes",
      icone: Users,
      cor: "bg-purple-500",
      funcionalidades: [
        "Cadastro completo de clientes",
        "Histórico de compras",
        "Classificação (Frequente, Inativo, VIP)",
        "Lista de aniversariantes",
        "Comunicação via WhatsApp/E-mail"
      ],
      rota: "/clientes",
      status: "ativo"
    },
    {
      titulo: "Financeiro",
      descricao: "Controle financeiro e fluxo de caixa",
      icone: DollarSign,
      cor: "bg-yellow-500",
      funcionalidades: [
        "Contas a pagar e receber",
        "Fluxo de caixa diário/semanal/mensal",
        "Integração com vendas",
        "Emissão de recibos e boletos",
        "Relatórios financeiros"
      ],
      rota: "/fluxo-caixa",
      status: "ativo"
    },
    {
      titulo: "Relatórios e Indicadores",
      descricao: "Análises e relatórios gerenciais",
      icone: BarChart3,
      cor: "bg-indigo-500",
      funcionalidades: [
        "Gráficos de vendas mensais",
        "Produtos mais vendidos",
        "Clientes que mais compram",
        "Estoque parado",
        "Exportação PDF/Excel"
      ],
      rota: "/relatorios",
      status: "ativo"
    },
    {
      titulo: "Administração",
      descricao: "Gestão de usuários e sistema",
      icone: Settings,
      cor: "bg-gray-500",
      funcionalidades: [
        "Controle de usuários e permissões",
        "Log de atividades",
        "Backup automático",
        "Sistema de login",
        "Controle de acesso por módulo"
      ],
      rota: "/admin",
      status: "desenvolvimento"
    }
  ];

  const alertas = [
    { tipo: "estoque", mensagem: "5 produtos com estoque baixo", cor: "destructive" },
    { tipo: "financeiro", mensagem: "3 contas vencendo hoje", cor: "default" },
    { tipo: "aniversario", mensagem: "2 clientes aniversariam hoje", cor: "secondary" }
  ];

  const metricas = [
    { titulo: "Vendas Hoje", valor: "R$ 1.245,80", variacao: "+12%", icone: ShoppingCart },
    { titulo: "Produtos Ativos", valor: "456", variacao: "+8", icone: Package },
    { titulo: "Clientes Cadastrados", valor: "89", variacao: "+3", icone: Users },
    { titulo: "Saldo em Caixa", valor: "R$ 8.750,00", variacao: "+5%", icone: DollarSign }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Leaf className="h-8 w-8 text-viveiro-green" />
          <h1 className="text-2xl font-bold text-viveiro-gray-dark">
            Sistema de Gestão - Viveiro <span className="text-viveiro-yellow">EBENEZER</span>
          </h1>
        </div>
        <p className="text-viveiro-gray-dark/70">
          Plataforma completa para gestão do seu viveiro de plantas
        </p>
      </div>

      {/* Alertas */}
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="h-5 w-5" />
            Alertas do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {alertas.map((alerta, index) => (
              <Badge key={index} variant={alerta.cor as any} className="px-3 py-1">
                {alerta.mensagem}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricas.map((metrica, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metrica.titulo}</CardTitle>
              <metrica.icone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-viveiro-green">{metrica.valor}</div>
              <p className="text-xs text-muted-foreground">
                {metrica.variacao} em relação ao período anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Módulos do Sistema */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-viveiro-gray-dark">Módulos do Sistema</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {modulos.map((modulo, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${modulo.cor} text-white`}>
                      <modulo.icone className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{modulo.titulo}</CardTitle>
                      <CardDescription>{modulo.descricao}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={modulo.status === "ativo" ? "default" : "secondary"}>
                    {modulo.status === "ativo" ? "Ativo" : "Em Desenvolvimento"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-700">Funcionalidades:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {modulo.funcionalidades.map((func, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-viveiro-green mt-2 flex-shrink-0"></span>
                        {func}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3">
                    {modulo.status === "ativo" ? (
                      <Button asChild className="w-full">
                        <Link to={modulo.rota}>
                          Acessar Módulo
                        </Link>
                      </Button>
                    ) : (
                      <Button disabled className="w-full">
                        Em Desenvolvimento
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Acesso Rápido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Acesso Rápido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" asChild>
              <Link to="/vendas" className="flex flex-col items-center gap-2 h-auto py-4">
                <ShoppingCart className="h-6 w-6" />
                Nova Venda
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/produtos" className="flex flex-col items-center gap-2 h-auto py-4">
                <Package className="h-6 w-6" />
                Novo Produto
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/clientes" className="flex flex-col items-center gap-2 h-auto py-4">
                <Users className="h-6 w-6" />
                Novo Cliente
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/relatorios" className="flex flex-col items-center gap-2 h-auto py-4">
                <BarChart3 className="h-6 w-6" />
                Relatórios
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Suporte Técnico</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">
              Para dúvidas ou problemas técnicos
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Contatar Suporte
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Backup do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">
              Último backup: Hoje às 03:00
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Fazer Backup Manual
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Versão do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">
              Versão 2.1.0 - Atualizado
            </p>
            <Badge variant="secondary" className="text-xs">
              Stable
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
