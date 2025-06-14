import { useState } from "react";
import { Plus, RefreshCw, ChevronDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NovoRegistroCaixaModal from "@/components/NovoRegistroCaixaModal";

const FluxoCaixa = () => {
  const [registros, setRegistros] = useState([
    {
      id: 1,
      data: "10/06/2025 19:27",
      descricao: "Entrada em dinheiro da venda #a3d97cb3",
      tipo: "Entrada",
      formaPagamento: "Dinheiro",
      valor: 4.90
    },
    {
      id: 2,
      data: "10/06/2025 19:27",
      descricao: "Entrada em cartão de crédito da venda #a3d97cb3",
      tipo: "Entrada",
      formaPagamento: "Crédito",
      valor: 50.00
    },
    {
      id: 3,
      data: "10/06/2025 19:27",
      descricao: "Troco em dinheiro da venda #a3d97cb3",
      tipo: "Saída",
      formaPagamento: "Dinheiro",
      valor: 0.00
    },
    {
      id: 4,
      data: "10/06/2025 19:19",
      descricao: "Entrada em dinheiro da venda #9916dcda",
      tipo: "Entrada",
      formaPagamento: "Dinheiro",
      valor: 5.00
    },
    {
      id: 5,
      data: "10/06/2025 19:19",
      descricao: "Entrada em cartão de crédito da venda #9916dcda",
      tipo: "Entrada",
      formaPagamento: "Crédito",
      valor: 20.90
    },
    {
      id: 6,
      data: "10/06/2025 19:18",
      descricao: "Abertura de caixa",
      tipo: "Entrada",
      formaPagamento: "-",
      valor: 200.00
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const entradas = registros
    .filter(r => r.tipo === "Entrada")
    .reduce((sum, r) => sum + r.valor, 0);

  const saidas = registros
    .filter(r => r.tipo === "Saída")
    .reduce((sum, r) => sum + r.valor, 0);

  const saldo = entradas - saidas;

  const removeRegistro = (id: number) => {
    setRegistros(registros.filter(r => r.id !== id));
  };

  const handleNovoRegistro = (novoRegistro: any) => {
    setRegistros([novoRegistro, ...registros]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fluxo de Caixa</h1>
          <div className="text-sm text-gray-500 mt-1">
            <span className="text-orange-500">Home</span> / Fluxo de Caixa
          </div>
        </div>
        <div className="text-sm text-gray-500">
          victor augusto
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500 font-normal">Entradas</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-green-600">
              R$ {entradas.toFixed(2).replace('.', ',')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500 font-normal">Saídas</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-red-600">
              R$ {saidas.toFixed(2).replace('.', ',')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500 font-normal">Saldo</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-green-600">
              R$ {saldo.toFixed(2).replace('.', ',')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-3">
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Registro
          </Button>
          <Button variant="outline" className="border-gray-300">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sincronizar Vendas
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              defaultValue="2025-06-01"
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <span className="text-gray-400">—</span>
            <input 
              type="date" 
              defaultValue="2025-06-14"
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <Select defaultValue="forma-pagamento">
            <SelectTrigger className="w-[180px] border-gray-300">
              <SelectValue placeholder="Forma de pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="forma-pagamento">Forma de pagamento</SelectItem>
              <SelectItem value="dinheiro">Dinheiro</SelectItem>
              <SelectItem value="credito">Crédito</SelectItem>
              <SelectItem value="debito">Débito</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-gray-600 font-medium py-4 px-6">
                  Data <ChevronDown className="h-4 w-4 inline ml-1" />
                </TableHead>
                <TableHead className="text-gray-600 font-medium py-4 px-6">
                  Descrição
                </TableHead>
                <TableHead className="text-gray-600 font-medium py-4 px-6">
                  Tipo <ChevronDown className="h-4 w-4 inline ml-1" />
                </TableHead>
                <TableHead className="text-gray-600 font-medium py-4 px-6">
                  Forma de Pagamento
                </TableHead>
                <TableHead className="text-gray-600 font-medium py-4 px-6 text-right">
                  Valor <ChevronDown className="h-4 w-4 inline ml-1" />
                </TableHead>
                <TableHead className="text-gray-600 font-medium py-4 px-6 text-center">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registros.map((registro) => (
                <TableRow key={registro.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell className="py-4 px-6 text-gray-700 text-sm">
                    {registro.data}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-gray-700 text-sm">
                    {registro.descricao}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      registro.tipo === "Entrada" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {registro.tipo === "Entrada" ? "↑" : "↓"} {registro.tipo}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      registro.formaPagamento === "Dinheiro" 
                        ? "bg-green-100 text-green-800" 
                        : registro.formaPagamento === "Crédito"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {registro.formaPagamento}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right font-medium">
                    <span className={registro.tipo === "Entrada" ? "text-green-600" : "text-red-600"}>
                      {registro.tipo === "Entrada" ? "+" : "-"} R$ {registro.valor.toFixed(2).replace('.', ',')}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeRegistro(registro.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginação */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-orange-500 text-white border-orange-500">
            1
          </Button>
        </div>
      </div>

      <NovoRegistroCaixaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleNovoRegistro}
      />
    </div>
  );
};

export default FluxoCaixa;
