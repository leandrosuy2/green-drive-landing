import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Building2, ArrowLeft } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const Cadastro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <Button
            variant="ghost"
            className="mb-6 -ml-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Escolha o Tipo de Cadastro</h1>
            <p className="text-muted-foreground">
              Selecione o tipo de pessoa para continuar com o cadastro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pessoa Física */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 mx-auto">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-center">Pessoa Física</CardTitle>
                <CardDescription className="text-center">
                  Cadastro para pessoa física (CPF)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => navigate("/cadastro/pf")}
                >
                  Cadastrar como Pessoa Física
                </Button>
              </CardContent>
            </Card>

            {/* Pessoa Jurídica */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 mx-auto">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-center">Pessoa Jurídica</CardTitle>
                <CardDescription className="text-center">
                  Cadastro para pessoa jurídica (CNPJ)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => navigate("/cadastro/pj")}
                >
                  Cadastrar como Pessoa Jurídica
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cadastro;

