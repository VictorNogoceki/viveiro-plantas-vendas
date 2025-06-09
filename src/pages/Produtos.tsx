
import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Plus, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Produto {
  id: number;
  nome: string;
  especie: string;
  categoria: string;
  quantidade: number;
  preco: number;
  descricao: string;
}

const Produtos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([
    {
      id: 1,
      nome: "Rosa Vermelha",
      especie: "Rosa rubiginosa",
      categoria: "Flores",
      quantidade: 50,
      preco: 15.90,
      descricao: "Rosa vermelha linda para jardim"
    },
    {
      id: 2,
      nome: "Samambaia",
      especie: "Nephrolepis exaltata",
      categoria: "Folhagem",
      quantidade: 30,
      preco: 25.00,
      descricao: "Samambaia ideal para ambientes internos"
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    especie: '',
    categoria: '',
    quantidade: '',
    preco: '',
    descricao: ''
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.especie || !formData.quantidade || !formData.preco) {
      toast({
        title: "Erro",
        description: "Por favor, preencha os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const novoProduto: Produto = {
      id: produtos.length + 1,
      nome: formData.nome,
      especie: formData.especie,
      categoria: formData.categoria,
      quantidade: parseInt(formData.quantidade),
      preco: parseFloat(formData.preco),
      descricao: formData.descricao
    };

    setProdutos([...produtos, novoProduto]);
    setFormData({
      nome: '',
      especie: '',
      categoria: '',
      quantidade: '',
      preco: '',
      descricao: ''
    });
    setShowForm(false);

    toast({
      title: "Sucesso",
      description: "Produto cadastrado com sucesso!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Leaf className="h-8 w-8 text-green-600" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Cadastro de Produtos</h1>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Produto
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cadastrar Novo Produto</CardTitle>
              <CardDescription>Preencha os dados do produto/planta</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome da Planta *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      placeholder="Ex: Rosa Vermelha"
                    />
                  </div>
                  <div>
                    <Label htmlFor="especie">Espécie *</Label>
                    <Input
                      id="especie"
                      value={formData.especie}
                      onChange={(e) => setFormData({...formData, especie: e.target.value})}
                      placeholder="Ex: Rosa rubiginosa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Input
                      id="categoria"
                      value={formData.categoria}
                      onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                      placeholder="Ex: Flores, Folhagem, Suculentas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantidade">Quantidade em Estoque *</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      value={formData.quantidade}
                      onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preco">Preço Unitário (R$) *</Label>
                    <Input
                      id="preco"
                      type="number"
                      step="0.01"
                      value={formData.preco}
                      onChange={(e) => setFormData({...formData, preco: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={formData.descricao}
                      onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                      placeholder="Descrição detalhada do produto"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Salvar Produto</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lista de Produtos ({produtos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Espécie</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">{produto.nome}</TableCell>
                    <TableCell>{produto.especie}</TableCell>
                    <TableCell>{produto.categoria}</TableCell>
                    <TableCell>
                      <span className={produto.quantidade < 10 ? "text-red-600" : "text-green-600"}>
                        {produto.quantidade}
                      </span>
                    </TableCell>
                    <TableCell>R$ {produto.preco.toFixed(2)}</TableCell>
                    <TableCell className="max-w-xs truncate">{produto.descricao}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Produtos;
