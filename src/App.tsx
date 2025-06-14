
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Clientes from "./pages/Clientes";
import Produtos from "./pages/Produtos";
import Estoque from "./pages/Estoque";
import Pedidos from "./pages/Pedidos";
import Vendas from "./pages/Vendas";
import NotasFiscais from "./pages/NotasFiscais";
import Relatorios from "./pages/Relatorios";
import FluxoCaixa from "./pages/FluxoCaixa";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
              </header>
              <div className="flex flex-1 flex-col gap-4 p-4">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/clientes" element={<Clientes />} />
                  <Route path="/produtos" element={<Produtos />} />
                  <Route path="/estoque" element={<Estoque />} />
                  <Route path="/pedidos" element={<Pedidos />} />
                  <Route path="/vendas" element={<Vendas />} />
                  <Route path="/notas-fiscais" element={<NotasFiscais />} />
                  <Route path="/relatorios" element={<Relatorios />} />
                  <Route path="/fluxo-caixa" element={<FluxoCaixa />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
