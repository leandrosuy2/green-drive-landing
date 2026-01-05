import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import locacaoService, { Locacao } from "@/services/locacaoService";
import docVeiculoService from "@/services/docVeiculoService";

const ListaDocVeiculos = () => {
  const [locacoes, setLocacoes] = useState<Locacao[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    locacaoService.listarLocacoes()
      .then((data) => {
        // Garante que todos os objetos tenham id_car, mesmo que null
        const ajustado = data.map(loc => ({ id_car: null, ...loc }));
        console.log('locacoes ajustadas:', ajustado);
        setLocacoes(ajustado);
      })
      .catch(() => setLocacoes([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Documentação de Veículos</h2>
      <p className="text-gray-600 mb-4">Aqui você poderá visualizar e gerenciar a documentação dos veículos locados.</p>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando veículos...</p>
        </div>
      ) : locacoes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-400">
            <FileText className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma documentação encontrada</h3>
            <p className="text-gray-500">Nenhum documento disponível para os seus veículos no momento.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {console.log('locacoes recebidas:', locacoes)}
          {locacoes.map((loc) => (
            <Card key={loc.id_loc} className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gray-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{loc.modelo_car} ({loc.placa_car})</CardTitle>
                  <div className="text-xs text-gray-600">{loc.nome_marca} - {loc.descricao_ctg}</div>
                </div>
                {typeof loc.id_car !== 'undefined' && loc.id_car !== null ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      console.log('id_car clicado:', loc.id_car);
                      const url = await docVeiculoService.getDocLink(loc.id_car);
                      if (url) window.open(url, "_blank");
                    }}
                  >
                    Ver Docs
                  </Button>
                ) : (
                  <span className="text-xs text-red-500">Sem id_car</span>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaDocVeiculos;
