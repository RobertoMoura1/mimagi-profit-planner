import { usePlanejamento } from '@/hooks/usePlanejamento';
import { useCompras } from '@/hooks/useCompras';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { VariaveisPrincipais } from '@/components/dashboard/sections/VariaveisPrincipais';
import { DistribuicaoPublico } from '@/components/dashboard/sections/DistribuicaoPublico';
import { RoupasSapatos } from '@/components/dashboard/sections/RoupasSapatos';
import { DistribuicaoMarcas } from '@/components/dashboard/sections/DistribuicaoMarcas';
import { TiposPeca } from '@/components/dashboard/sections/TiposPeca';
import { TicketMedio } from '@/components/dashboard/sections/TicketMedio';
import { CustosFixos } from '@/components/dashboard/sections/CustosFixos';
import { ResultadoLucro } from '@/components/dashboard/sections/ResultadoLucro';
import { PontoEquilibrio } from '@/components/dashboard/sections/PontoEquilibrio';
import { AlertasAutomaticos } from '@/components/dashboard/sections/AlertasAutomaticos';
import { Simulacao } from '@/components/dashboard/sections/Simulacao';
import { PlanejamentoCanais } from '@/components/dashboard/sections/PlanejamentoCanais';
import { AcompanhamentoMeta } from '@/components/dashboard/sections/AcompanhamentoMeta';
import { ComprasPagamentos } from '@/components/dashboard/sections/ComprasPagamentos';
import { FluxoCaixa } from '@/components/dashboard/sections/FluxoCaixa';
import { VisaoDiretoria } from '@/components/dashboard/sections/VisaoDiretoria';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { data, calculated, alerts, loading, saving, updateField, calculateSimulation, recordId } = usePlanejamento();
  
  const { 
    compras, 
    loading: comprasLoading, 
    saving: comprasSaving,
    addCompra,
    updateCompra,
    removeCompra,
    calcularCalendario,
    calcularFluxoCaixa,
    calcularResumoExecutivo,
    getTotalComprometido,
  } = useCompras(recordId, calculated.custo_fixo_mensal, data.margem, calculated.faturamento_mensal);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando planejamento...</p>
        </div>
      </div>
    );
  }

  const fluxoCaixa = calcularFluxoCaixa();
  const resumoExecutivo = calcularResumoExecutivo();
  const totalComprometido = getTotalComprometido();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader saving={saving || comprasSaving} />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="variaveis" className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-2 mb-6">
            <TabsTrigger value="variaveis" className="flex-1 min-w-[80px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">
              Variáveis
            </TabsTrigger>
            <TabsTrigger value="distribuicao" className="flex-1 min-w-[80px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">
              Distribuição
            </TabsTrigger>
            <TabsTrigger value="produtos" className="flex-1 min-w-[80px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">
              Produtos
            </TabsTrigger>
            <TabsTrigger value="custos" className="flex-1 min-w-[80px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">
              Custos
            </TabsTrigger>
            <TabsTrigger value="compras" className="flex-1 min-w-[80px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">
              Compras
            </TabsTrigger>
            <TabsTrigger value="fluxo" className="flex-1 min-w-[80px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">
              Fluxo Caixa
            </TabsTrigger>
            <TabsTrigger value="resultados" className="flex-1 min-w-[80px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">
              Resultados
            </TabsTrigger>
            <TabsTrigger value="simulacao" className="flex-1 min-w-[80px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">
              Simulação
            </TabsTrigger>
            <TabsTrigger value="canais" className="flex-1 min-w-[80px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">
              Canais
            </TabsTrigger>
          </TabsList>

          <TabsContent value="variaveis" className="space-y-6">
            <VariaveisPrincipais data={data} calculated={calculated} updateField={updateField} />
          </TabsContent>

          <TabsContent value="distribuicao" className="space-y-6">
            <DistribuicaoPublico data={data} calculated={calculated} updateField={updateField} />
            <RoupasSapatos data={data} calculated={calculated} updateField={updateField} />
          </TabsContent>

          <TabsContent value="produtos" className="space-y-6">
            <DistribuicaoMarcas data={data} calculated={calculated} updateField={updateField} />
            <TiposPeca data={data} updateField={updateField} />
            <TicketMedio data={data} calculated={calculated} updateField={updateField} />
          </TabsContent>

          <TabsContent value="custos" className="space-y-6">
            <CustosFixos data={data} calculated={calculated} updateField={updateField} />
          </TabsContent>

          <TabsContent value="compras" className="space-y-6">
            <ComprasPagamentos 
              compras={compras}
              saving={comprasSaving}
              addCompra={addCompra}
              updateCompra={updateCompra}
              removeCompra={removeCompra}
              calcularCalendario={calcularCalendario}
              totalComprometido={totalComprometido}
            />
          </TabsContent>

          <TabsContent value="fluxo" className="space-y-6">
            <VisaoDiretoria resumo={resumoExecutivo} totalComprometido={totalComprometido} />
            <FluxoCaixa fluxoCaixa={fluxoCaixa} faturamentoMensal={calculated.faturamento_mensal} />
          </TabsContent>

          <TabsContent value="resultados" className="space-y-6">
            <AcompanhamentoMeta data={data} calculated={calculated} updateField={updateField} />
            <ResultadoLucro calculated={calculated} />
            <PontoEquilibrio calculated={calculated} />
            <AlertasAutomaticos alerts={alerts} />
          </TabsContent>

          <TabsContent value="simulacao" className="space-y-6">
            <Simulacao calculateSimulation={calculateSimulation} currentFaturamento={calculated.faturamento_mensal} />
          </TabsContent>

          <TabsContent value="canais" className="space-y-6">
            <PlanejamentoCanais data={data} calculated={calculated} updateField={updateField} />
          </TabsContent>
        </Tabs>
        
        <footer className="text-center text-sm text-muted-foreground py-8 border-t border-border mt-8">
          <p>Mimagi Profit Planner © {new Date().getFullYear()}</p>
          <p className="mt-1">Dados salvos automaticamente no banco de dados.</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
