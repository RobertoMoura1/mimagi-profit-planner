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
      
      <main className="container mx-auto px-4 py-8 space-y-6">
        <VariaveisPrincipais data={data} calculated={calculated} updateField={updateField} />
        <DistribuicaoPublico data={data} calculated={calculated} updateField={updateField} />
        <RoupasSapatos data={data} calculated={calculated} updateField={updateField} />
        <DistribuicaoMarcas data={data} calculated={calculated} updateField={updateField} />
        <TiposPeca data={data} updateField={updateField} />
        <TicketMedio data={data} calculated={calculated} updateField={updateField} />
        <CustosFixos data={data} calculated={calculated} updateField={updateField} />
        <ResultadoLucro calculated={calculated} />
        <PontoEquilibrio calculated={calculated} />
        <AlertasAutomaticos alerts={alerts} />
        <Simulacao calculateSimulation={calculateSimulation} currentFaturamento={calculated.faturamento_mensal} />
        
        <footer className="text-center text-sm text-muted-foreground py-8 border-t border-border">
          <p>Mimagi Profit Planner © {new Date().getFullYear()}</p>
          <p className="mt-1">Dados salvos automaticamente no banco de dados.</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
