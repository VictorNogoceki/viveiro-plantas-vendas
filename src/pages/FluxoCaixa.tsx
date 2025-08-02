import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFluxoCaixa, deleteFluxoCaixaRegistro } from "@/services/fluxoCaixaService";
import { useToast } from "@/hooks/use-toast";
import NovoRegistroCaixaModal from "@/components/NovoRegistroCaixaModal";

const FluxoCaixa = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: registros = [], isLoading } = useQuery({
    queryKey: ['fluxo-caixa'],
    queryFn: getFluxoCaixa,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataInicio, setDataInicio] = useState("2025-06-01");
  const [dataFim, setDataFim] = useState("2025-06-14");
  const [formaPagamentoFiltro, setFormaPagamentoFiltro] = useState("todos");

  // Função para filtrar registros
  const filtrarRegistros = () => {
    return registros.filter(registro => {
      // Converter data do registro para comparação (formato ISO do banco)
      const dataRegistro = new Date(registro.data || '');
      
      // Converter datas dos filtros
      const dataInicioFiltro = new Date(dataInicio);
      const dataFimFiltro = new Date(dataFim);
      dataFimFiltro.setHours(23, 59, 59, 999); // Incluir até o final do dia
      
      // Verificar se a data está no período
      const dentroDataPeriodo = dataRegistro >= dataInicioFiltro && dataRegistro <= dataFimFiltro;
      
      // Extrair forma de pagamento da descrição
      const descricao = registro.descricao.toLowerCase();
      let formaPagamentoRegistro = "";
      
      if (descricao.includes("dinheiro")) formaPagamentoRegistro = "dinheiro";
      else if (descricao.includes("crédito") || descricao.includes("credito")) formaPagamentoRegistro = "credito";
      else if (descricao.includes("débito") || descricao.includes("debito")) formaPagamentoRegistro = "debito";
      
      // Verificar forma de pagamento
      const formaPagamentoMatch = formaPagamentoFiltro === "todos" || 
        formaPagamentoFiltro === formaPagamentoRegistro;
      
      return dentroDataPeriodo && formaPagamentoMatch;
    });
  };

  const registrosFiltrados = filtrarRegistros();

  const entradas = registrosFiltrados
    .filter(r => r.tipo === "entrada")
    .reduce((sum, r) => sum + r.valor, 0);

  const saidas = registrosFiltrados
    .filter(r => r.tipo === "saida")
    .reduce((sum, r) => sum + r.valor, 0);

  const saldo = entradas - saidas;

  const removeRegistro = async (id: string) => {
    try {
      await deleteFluxoCaixaRegistro(id);
      await queryClient.invalidateQueries({ queryKey: ['fluxo-caixa'] });
      toast({
        title: "Registro removido",
        description: "O registro foi removido com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover registro",
        description: error.message || "Não foi possível remover o registro.",
        variant: "destructive",
      });
    }
  };

  const handleNovoRegistro = async () => {
    await queryClient.invalidateQueries({ queryKey: ['fluxo-caixa'] });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fluxo de Caixa</h1>
          <div className="text-sm text-gray-500 mt-1">
            <span className="text-viveiro-green">Home</span> / Fluxo de Caixa
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500 font-normal">Entradas</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-viveiro-green">
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
            <div className="text-2xl font-bold text-viveiro-green">
              R$ {saldo.toFixed(2).replace('.', ',')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-3">
          <Button 
            className="bg-viveiro-green hover:bg-viveiro-green/90 text-white"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Registro
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <span className="text-gray-400">—</span>
            <input 
              type="date" 
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <Select value={formaPagamentoFiltro} onValueChange={setFormaPagamentoFiltro}>
            <SelectTrigger className="w-[180px] border-gray-300">
              <SelectValue placeholder="Forma de pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as formas</SelectItem>
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Carregando registros...
                  </TableCell>
                </TableRow>
              ) : registrosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Nenhum registro encontrado no período selecionado.
                  </TableCell>
                </TableRow>
              ) : (
                registrosFiltrados.map((registro) => {
                  const dataFormatada = new Date(registro.data || '').toLocaleString('pt-BR');
                  const tipoCapitalizado = registro.tipo === "entrada" ? "Entrada" : "Saída";
                  
                  // Extrair forma de pagamento da descrição
                  let formaPagamento = "-";
                  const descricao = registro.descricao.toLowerCase();
                  if (descricao.includes("dinheiro")) formaPagamento = "Dinheiro";
                  else if (descricao.includes("crédito") || descricao.includes("credito")) formaPagamento = "Crédito";
                  else if (descricao.includes("débito") || descricao.includes("debito")) formaPagamento = "Débito";
                  
                  return (
                    <TableRow key={registro.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <TableCell className="py-4 px-6 text-gray-700 text-sm">
                        {dataFormatada}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-700 text-sm">
                        {registro.descricao}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          registro.tipo === "entrada" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {registro.tipo === "entrada" ? "↑" : "↓"} {tipoCapitalizado}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          formaPagamento === "Dinheiro" 
                            ? "bg-green-100 text-green-800" 
                            : formaPagamento === "Crédito"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {formaPagamento}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right font-medium">
                        <span className={registro.tipo === "entrada" ? "text-viveiro-green" : "text-red-600"}>
                          {registro.tipo === "entrada" ? "+" : "-"} R$ {registro.valor.toFixed(2).replace('.', ',')}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeRegistro(registro.id!)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginação */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-viveiro-green text-white border-viveiro-green">
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
