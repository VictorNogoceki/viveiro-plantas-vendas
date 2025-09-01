import { Leaf, Users, Package, ShoppingCart, TrendingUp, AlertTriangle, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { 
  getDashboardStats, 
  getVendasEvolution, 
  getProdutosMaisVendidos, 
  getEstoqueBaixo, 
  getTopClientes, 
  getUltimosPedidos 
} from "@/services/dashboardService";

const Index = () => {
  // Busca dados reais do sistema
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  const { data: vendasData = [] } = useQuery({
    queryKey: ['vendas-evolution'],
    queryFn: getVendasEvolution,
  });

  const { data: produtosMaisVendidos = [] } = useQuery({
    queryKey: ['produtos-mais-vendidos'],
    queryFn: getProdutosMaisVendidos,
  });

  const { data: estoquesBaixos = [] } = useQuery({
    queryKey: ['estoque-baixo'],
    queryFn: getEstoqueBaixo,
  });

  const { data: topClientes = [] } = useQuery({
    queryKey: ['top-clientes'],
    queryFn: getTopClientes,
  });

  const { data: ultimosPedidos = [] } = useQuery({
    queryKey: ['ultimos-pedidos'],
    queryFn: getUltimosPedidos,
  });

  const chartConfig = {
    vendas: {
      label: "Vendas",
      color: "#059669"
    },
    clientes: {
      label: "Clientes",
      color: "#059669"
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Leaf className="h-8 w-8 text-viveiro-green" />
          <h1 className="text-2xl font-bold text-viveiro-gray-dark">
            Dashboard - Viveiro <span className="text-viveiro-yellow">EBENEZER</span>
          </h1>
        </div>
        <p className="text-viveiro-gray-dark/70">
          Visão geral das vendas, estoque e clientes
        </p>
      </div>

      {/* Cards Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-viveiro-green">
              R$ {stats?.totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Vendas realizadas este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Realizados</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-viveiro-green">{stats?.totalPedidos || 0}</div>
            <p className="text-xs text-muted-foreground">
              Pedidos realizados este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-viveiro-green">{stats?.totalClientes || 0}</div>
            <p className="text-xs text-muted-foreground">
              Clientes cadastrados no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-viveiro-green">{stats?.totalProdutos || 0}</div>
            <p className="text-xs text-muted-foreground">
              Valor total: R$ {stats?.valorEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução das Vendas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Evolução das Vendas (7 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vendasData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="vendas" 
                    stroke="var(--color-vendas)" 
                    strokeWidth={2}
                    dot={{ fill: "var(--color-vendas)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Produtos Mais Vendidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produtos Mais Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={produtosMaisVendidos} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="produto" type="category" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="vendas" fill="var(--color-vendas)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Novos Clientes */}
        {vendasData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resumo de Vendas (Últimos 7 dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-viveiro-green">
                  R$ {vendasData.reduce((acc, item) => acc + item.vendas, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-muted-foreground">Total vendido nos últimos 7 dias</p>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Seção Inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estoque Baixo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {estoquesBaixos.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span className="font-medium">{item.produto}</span>
                  <span className="text-red-600 font-bold">{item.estoque} un.</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Clientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topClientes.map((cliente, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{cliente.nome}</p>
                    <p className="text-sm text-muted-foreground">{cliente.pedidos} pedidos</p>
                  </div>
                  <span className="font-bold text-viveiro-green">{cliente.compras}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Últimos Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Últimos Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimosPedidos.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell className="font-medium">{pedido.cliente}</TableCell>
                    <TableCell>R$ {pedido.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {pedido.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
