import { Calendar, ClipboardList, Home, Package, Warehouse, Users, ShoppingCart, FileText, BarChart3, DollarSign } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Clientes",
    url: "/clientes",
    icon: Users,
  },
  {
    title: "Produtos",
    url: "/produtos",
    icon: Package,
  },
  {
    title: "Estoque",
    url: "/estoque",
    icon: Warehouse,
  },
  {
    title: "Pedidos",
    url: "/pedidos",
    icon: ClipboardList,
  },
  {
    title: "Vendas",
    url: "/vendas",
    icon: ShoppingCart,
  },
  {
    title: "Fluxo de Caixa",
    url: "/fluxo-caixa",
    icon: DollarSign,
  },
  {
    title: "Notas Fiscais",
    url: "/notas-fiscais",
    icon: FileText,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar 
      className="bg-viveiro-gray border-r-2 border-viveiro-green"
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-viveiro-gray-dark text-lg font-bold mb-4">
            Viveiro <span className="text-viveiro-yellow">EBENEZER</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="text-viveiro-gray-dark hover:bg-viveiro-green hover:text-white border border-viveiro-green/20"
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
