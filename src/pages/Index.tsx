import { Leaf, Users, Package, ShoppingCart, TrendingUp, AlertTriangle, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";

const Index = () => {
  // Dados mockados para demonstração
  const vendasData = [
    { data: "01/06", vendas: 1200 },
    { data: "02/06", vendas: 1800 },
    { data: "03/06", vendas: 2400 },
    { data: "04/06", vendas: 1600 },
    { data: "05/06", vendas: 2800 },
    { data: "06/06", vendas: 3200 },
    { data: "07/06", vendas: 2900 },
  ];

  const produtosMaisVendidos = [
    { produto: "Rosa Vermelha", vendas: 45 },
    { produto: "Violeta", vendas: 38 },
    { produto: "Orquídea", vendas: 32 },
    { produto: "Suculenta Mix", vendas: 28 },
    { produto: "Manjericão", vendas: 24 },
  ];

  const novosClientes = [
    { periodo: "Sem 1", clientes: 12 },
    { periodo: "Sem 2", clientes: 18 },
    { periodo: "Sem 3", clientes: 15 },
    { periodo: "Sem 4", clientes: 22 },
  ];

  const estoquesBaixos = [
    { produto: "Rosa Branca", estoque: 3, minimo: 10 },
    { produto: "Girassol", estoque: 5, minimo: 15 },
    { produto: "Fertilizante NPK", estoque: 2, minimo: 8 },
  ];

  const ultimosPedidos = [
    { id: "001", cliente: "Maria Santos", valor: 89.90, status: "Concluído", data: "08/06/2025" },
    { id: "002", cliente: "João Silva", valor: 156.50, status: "Pendente", data: "08/06/2025" },
    { id: "003", cliente: "Ana Costa", valor: 67.30, status: "Concluído", data: "07/06/2025" },
    { id: "004", cliente: "Pedro Oliveira", valor: 234.80, status: "Em andamento", data: "07/06/2025" },
  ];

  const topClientes = [
    { nome: "Maria Santos", compras: "R$ 1.245,90", pedidos: 8 },
    { nome: "João Silva", compras: "R$ 987,60", pedidos: 6 },
    { nome: "Ana Costa", compras: "R$ 756,40", pedidos: 5 },
  ];

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
            Dashboard - Viveiro <span className="text-viveiro-green">EBENEZER</span>
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
            <div className="text-2xl font-bold text-viveiro-green">R$ 15.900</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Realizados</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-viveiro-green">127</div>
            <p className="text-xs text-muted-foreground">
              +8% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-viveiro-green">89</div>
            <p className="text-xs text-muted-foreground">
              +15% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-viveiro-green">456</div>
            <p className="text-xs text-muted-foreground">
              Valor total: R$ 28.450
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Novos Clientes por Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={novosClientes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="clientes" 
                  stroke="var(--color-clientes)" 
                  fill="var(--color-clientes)"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

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
                    <TableCell>R$ {pedido.valor}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pedido.status === 'Concluído' 
                          ? 'bg-green-100 text-green-800'
                          : pedido.status === 'Pendente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
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
