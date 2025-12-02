import { FileDown, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  saving: boolean;
  onExportPDF: () => void;
}

export function DashboardHeader({ saving, onExportPDF }: DashboardHeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">MIMAGI PROFIT PLANNER</h1>
            <p className="text-primary-foreground/70 text-sm mt-1">Dashboard Financeiro Corporativo</p>
          </div>
          <div className="flex items-center gap-4">
            {saving && (
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Salvando...</span>
              </div>
            )}
            <Button
              onClick={onExportPDF}
              variant="outline"
              className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
