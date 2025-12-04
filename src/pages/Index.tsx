import { usePlanejamento } from '@/hooks/usePlanejamento';
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
import { exportToPDF } from '@/utils/exportPDF';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { data, calculated, alerts, loading, saving, updateField, calculateSimulation } = usePlanejamento();

  const handleExportPDF = () => {
    const simulation = calculateSimulation(calculated.faturamento_mensal * 1.5);
    exportToPDF(data, calculated, simulation);
  };

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

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader saving={saving} onExportPDF={handleExportPDF} />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="variaveis" className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-2 mb-6">
            <TabsTrigger value="variaveis" className="flex-1 min-w-[120px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Variáveis
            </TabsTrigger>
            <TabsTrigger value="distribuicao" className="flex-1 min-w-[120px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Distribuição
            </TabsTrigger>
            <TabsTrigger value="produtos" className="flex-1 min-w-[120px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Produtos
            </TabsTrigger>
            <TabsTrigger value="custos" className="flex-1 min-w-[120px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Custos
            </TabsTrigger>
            <TabsTrigger value="resultados" className="flex-1 min-w-[120px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Resultados
            </TabsTrigger>
            <TabsTrigger value="simulacao" className="flex-1 min-w-[120px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Simulação
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

          <TabsContent value="resultados" className="space-y-6">
            <ResultadoLucro calculated={calculated} />
            <PontoEquilibrio calculated={calculated} />
            <AlertasAutomaticos alerts={alerts} />
          </TabsContent>

          <TabsContent value="simulacao" className="space-y-6">
            <Simulacao calculateSimulation={calculateSimulation} currentFaturamento={calculated.faturamento_mensal} />
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
