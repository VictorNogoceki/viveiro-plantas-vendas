
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

interface EstoqueHeaderProps {
  children: React.ReactNode;
}

const EstoqueHeader = ({ children }: EstoqueHeaderProps) => {
  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="text-primary">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <span className="text-gray-400">/</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-900">Estoque</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Tabs */}
      <Tabs defaultValue="produtos" className="w-full">
        <TabsList className="grid w-fit grid-cols-2 mb-6 bg-white border-b">
          <TabsTrigger 
            value="produtos" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent text-gray-600"
          >
            Produtos em Estoque
          </TabsTrigger>
          <TabsTrigger 
            value="historico" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent text-gray-600"
          >
            Histórico de Movimentações
          </TabsTrigger>
        </TabsList>

        {children}
      </Tabs>
    </div>
  );
};

export default EstoqueHeader;
