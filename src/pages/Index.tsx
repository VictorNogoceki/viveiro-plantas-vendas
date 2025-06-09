
import { Leaf, Users, Package, ShoppingCart, FileText, BarChart3, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const menuItems = [
    {
      title: "Cadastro de Clientes",
      description: "Gerencie dados dos seus clientes",
      icon: Users,
      path: "/clientes",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Cadastro de Produtos",
      description: "Gerencie plantas e produtos do viveiro",
      icon: Package,
      path: "/produtos",
      color: "bg-viveiro-green/20 text-viveiro-green"
    },
    {
      title: "Pedidos",
      description: "Gerencie pedidos de clientes",
      icon: ClipboardList,
      path: "/pedidos",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Registro de Vendas",
      description: "Registre vendas e atualize estoque",
      icon: ShoppingCart,
      path: "/vendas",
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Notas Fiscais",
      description: "Emita e gerencie notas fiscais",
      icon: FileText,
      path: "/notas-fiscais",
      color: "bg-orange-100 text-orange-600"
    },
    {
      title: "Relatórios Diários",
      description: "Visualize relatórios de vendas",
      icon: BarChart3,
      path: "/relatorios",
      color: "bg-red-100 text-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-viveiro-gray">
      <header className="bg-viveiro-gray shadow-sm border-b-2 border-viveiro-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Leaf className="h-8 w-8 text-viveiro-green" />
            <h1 className="text-2xl font-bold text-viveiro-gray-dark">
              Viveiro <span className="text-viveiro-yellow">EBENEZER</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-viveiro-gray-dark mb-4">
            Bem-vindo ao Sistema de Gestão do Viveiro
          </h2>
          <p className="text-lg text-viveiro-gray-dark/70 max-w-2xl mx-auto">
            Gerencie clientes, produtos, vendas e relatórios de forma simples e eficiente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-white border-2 border-viveiro-green/30">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-4`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-viveiro-gray-dark">{item.title}</CardTitle>
                  <CardDescription className="text-viveiro-gray-dark/70">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-viveiro-green font-medium">
                    Acessar →
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
