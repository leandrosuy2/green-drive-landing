import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, MapPin, Briefcase, Phone, Mail, Lock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TopNav from "@/components/landing/TopNav";
import Footer from "@/components/landing/Footer";

// Lista de estados do Brasil
const estadosBrasil = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const CadastroPF = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    // Identificação
    tipoPessoa: "PF",
    cpf: "",
    nomeCompleto: "",
    cnhNumero: "",
    cnhUf: "",
    cnhVencimento: "",
    
    // Endereço
    cep: "",
    rua: "",
    complemento: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    
    // Profissão
    descricaoProfissao: "",
    
    // Contato
    ddd: "",
    telefone: "",
    nomeContato: "",
    email: "",
    
    // Acesso
    senha: "",
    confirmarSenha: "",
    
    // Informações Adicionais
    outrasInformacoes: "",
    residencia: "",
    tempoResidencia: "",
    tipoTrabalho: "",
    tempoTrabalho: "",
    financiamento: "",
    cnh: ""
  });

  // Função para formatar CPF
  const formatarCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2');
    }
    return value;
  };

  // Função para formatar CEP
  const formatarCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  // Função para formatar telefone (sem DDD, apenas número)
  const formatarTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/^(\d{4})(\d)/, '$1-$2');
    }
    if (numbers.length <= 9) {
      return numbers.replace(/^(\d{5})(\d{4})$/, '$1-$2');
    }
    return value;
  };

  // Função para formatar data
  const formatarData = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers
        .replace(/^(\d{2})(\d)/, '$1/$2')
        .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }
    return value;
  };

  // Buscar endereço pelo CEP
  const buscarCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            rua: data.logradouro || prev.rua,
            bairro: data.bairro || prev.bairro,
            cidade: data.localidade || prev.cidade,
            estado: data.uf || prev.estado
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    let formattedValue = value;

    // Aplicar formatação conforme o campo
    if (field === 'cpf') {
      formattedValue = formatarCPF(value);
    } else if (field === 'cep') {
      formattedValue = formatarCEP(value);
      if (formattedValue.replace(/\D/g, '').length === 8) {
        buscarCEP(formattedValue);
      }
    } else if (field === 'telefone') {
      formattedValue = formatarTelefone(value);
    } else if (field === 'cnhVencimento') {
      formattedValue = formatarData(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validações básicas
    if (formData.senha !== formData.confirmarSenha) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As senhas não coincidem.",
      });
      setIsLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Aqui você faria a chamada para a API de cadastro
      // await authService.registerPF(formData);
      
      toast({
        title: "Cadastro realizado com sucesso! ✅",
        description: "Sua conta foi criada. Bem-vindo!",
      });

      // Redirecionar após sucesso
      setTimeout(() => {
        navigate("/painel");
      }, 2000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar ❌",
        description: error.message || "Não foi possível realizar o cadastro.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <Button
            variant="ghost"
            className="mb-6 -ml-4"
            onClick={() => navigate("/cadastro")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Cadastro - Pessoa Física</h1>
            <p className="text-muted-foreground">
              Preencha todos os campos para criar sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Identificação */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Identificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoPessoa">Tipo de Pessoa</Label>
                    <Input
                      id="tipoPessoa"
                      value="Pessoa Física"
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={(e) => handleChange('cpf', e.target.value)}
                      maxLength={14}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                  <Input
                    id="nomeCompleto"
                    placeholder="Nome completo"
                    value={formData.nomeCompleto}
                    onChange={(e) => handleChange('nomeCompleto', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnhNumero">CNH nº *</Label>
                    <Input
                      id="cnhNumero"
                      placeholder="Número da CNH"
                      value={formData.cnhNumero}
                      onChange={(e) => handleChange('cnhNumero', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnhUf">UF (CNH) *</Label>
                    <Select
                      value={formData.cnhUf}
                      onValueChange={(value) => handleChange('cnhUf', value)}
                      required
                    >
                      <SelectTrigger id="cnhUf">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {estadosBrasil.map((uf) => (
                          <SelectItem key={uf} value={uf}>
                            {uf}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnhVencimento">Vencimento CNH *</Label>
                    <Input
                      id="cnhVencimento"
                      placeholder="dd/mm/aaaa"
                      value={formData.cnhVencimento}
                      onChange={(e) => handleChange('cnhVencimento', e.target.value)}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP *</Label>
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      value={formData.cep}
                      onChange={(e) => handleChange('cep', e.target.value)}
                      maxLength={9}
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="rua">Rua *</Label>
                    <Input
                      id="rua"
                      placeholder="Logradouro"
                      value={formData.rua}
                      onChange={(e) => handleChange('rua', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número *</Label>
                    <Input
                      id="numero"
                      placeholder="Número"
                      value={formData.numero}
                      onChange={(e) => handleChange('numero', e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      placeholder="Complemento (opcional)"
                      value={formData.complemento}
                      onChange={(e) => handleChange('complemento', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro *</Label>
                    <Input
                      id="bairro"
                      placeholder="Bairro"
                      value={formData.bairro}
                      onChange={(e) => handleChange('bairro', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                      id="cidade"
                      placeholder="Cidade"
                      value={formData.cidade}
                      onChange={(e) => handleChange('cidade', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado *</Label>
                    <Select
                      value={formData.estado}
                      onValueChange={(value) => handleChange('estado', value)}
                      required
                    >
                      <SelectTrigger id="estado">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {estadosBrasil.map((uf) => (
                          <SelectItem key={uf} value={uf}>
                            {uf}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profissão / Atividade */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Profissão / Atividade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="descricaoProfissao">Descrição da Profissão *</Label>
                  <Textarea
                    id="descricaoProfissao"
                    placeholder="Ex: Advogado: atuo em direito empresarial..."
                    value={formData.descricaoProfissao}
                    onChange={(e) => handleChange('descricaoProfissao', e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contato */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ddd">DDD *</Label>
                    <Input
                      id="ddd"
                      placeholder="00"
                      value={formData.ddd}
                      onChange={(e) => handleChange('ddd', e.target.value.replace(/\D/g, '').slice(0, 2))}
                      maxLength={2}
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      placeholder="00000-0000"
                      value={formData.telefone}
                      onChange={(e) => handleChange('telefone', e.target.value)}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomeContato">Nome do Contato *</Label>
                  <Input
                    id="nomeContato"
                    placeholder="Pessoa de referência"
                    value={formData.nomeContato}
                    onChange={(e) => handleChange('nomeContato', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Acesso ao Sistema */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Acesso ao Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha *</Label>
                    <Input
                      id="senha"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.senha}
                      onChange={(e) => handleChange('senha', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      placeholder="Confirme sua senha"
                      value={formData.confirmarSenha}
                      onChange={(e) => handleChange('confirmarSenha', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações Adicionais */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Informações Adicionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="outrasInformacoes">Outras Informações</Label>
                  <Textarea
                    id="outrasInformacoes"
                    placeholder="Informações adicionais (opcional)"
                    value={formData.outrasInformacoes}
                    onChange={(e) => handleChange('outrasInformacoes', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="residencia">Residência</Label>
                    <Select
                      value={formData.residencia}
                      onValueChange={(value) => handleChange('residencia', value)}
                    >
                      <SelectTrigger id="residencia">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="propria">Própria</SelectItem>
                        <SelectItem value="alugada">Alugada</SelectItem>
                        <SelectItem value="cedida">Cedida</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tempoResidencia">Tempo de Residência</Label>
                    <Select
                      value={formData.tempoResidencia}
                      onValueChange={(value) => handleChange('tempoResidencia', value)}
                    >
                      <SelectTrigger id="tempoResidencia">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="menos-1-ano">Menos de 1 ano</SelectItem>
                        <SelectItem value="1-3-anos">1 a 3 anos</SelectItem>
                        <SelectItem value="3-5-anos">3 a 5 anos</SelectItem>
                        <SelectItem value="mais-5-anos">Mais de 5 anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoTrabalho">Tipo de Trabalho</Label>
                    <Select
                      value={formData.tipoTrabalho}
                      onValueChange={(value) => handleChange('tipoTrabalho', value)}
                    >
                      <SelectTrigger id="tipoTrabalho">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="empresa-propria">Empresa Própria</SelectItem>
                        <SelectItem value="autonomo">Autônomo</SelectItem>
                        <SelectItem value="clt">CLT</SelectItem>
                        <SelectItem value="societario">Societário</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tempoTrabalho">Tempo de Trabalho</Label>
                    <Select
                      value={formData.tempoTrabalho}
                      onValueChange={(value) => handleChange('tempoTrabalho', value)}
                    >
                      <SelectTrigger id="tempoTrabalho">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="menos-1-ano">Menos de 1 ano</SelectItem>
                        <SelectItem value="1-3-anos">1 a 3 anos</SelectItem>
                        <SelectItem value="3-5-anos">3 a 5 anos</SelectItem>
                        <SelectItem value="mais-5-anos">Mais de 5 anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="financiamento">Financiamento</Label>
                    <Select
                      value={formData.financiamento}
                      onValueChange={(value) => handleChange('financiamento', value)}
                    >
                      <SelectTrigger id="financiamento">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="possui">Possui</SelectItem>
                        <SelectItem value="nao-possui">Não possui</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnh">CNH</Label>
                    <Select
                      value={formData.cnh}
                      onValueChange={(value) => handleChange('cnh', value)}
                    >
                      <SelectTrigger id="cnh">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="propria">Própria</SelectItem>
                        <SelectItem value="terceiro">Terceiro</SelectItem>
                        <SelectItem value="avalista">Avalista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator className="my-6" />

            {/* Botões de Ação */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/cadastro")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="min-w-[150px]"
              >
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CadastroPF;

