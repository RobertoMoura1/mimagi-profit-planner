import { DollarSign, TrendingUp } from 'lucide-react';
import { SectionCard } from '../SectionCard';
import { InputField } from '../InputField';
import { MetricCard } from '../MetricCard';
import { PlanejamentoFinanceiro, CalculatedValues } from '@/types/financial';
import { formatCurrency } from '@/utils/formatters';

interface Props {
  data: PlanejamentoFinanceiro;
  calculated: CalculatedValues;
  updateField: <K extends keyof PlanejamentoFinanceiro>(field: K, value: PlanejamentoFinanceiro[K]) => void;
}

export function VariaveisPrincipais({ data, calculated, updateField }: Props) {
  return (
    <SectionCard title="1. VARIÁVEIS PRINCIPAIS" icon={<DollarSign className="w-5 h-5" />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <InputField
          label="Investimento Total por Ciclo (6 meses)"
          value={data.investimento_ciclo}
          onChange={(v) => updateField('investimento_ciclo', v as number)}
          prefix="R$"
          step={1000}
        />
        <InputField
          label="Margem (Markup)"
          value={data.margem}
          onChange={(v) => updateField('margem', v as number)}
          suffix="x"
          step={0.1}
          min={1}
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Investimento Mensal"
          value={formatCurrency(calculated.investimento_mensal)}
          variant="primary"
        />
        <MetricCard
          title="Faturamento Mensal"
          value={formatCurrency(calculated.faturamento_mensal)}
          variant="accent"
        />
        <MetricCard
          title="Faturamento Ciclo"
          value={formatCurrency(calculated.faturamento_ciclo)}
          variant="success"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          title="Margem Aplicada"
          value={`${data.margem}x`}
          subtitle={`${((data.margem - 1) * 100).toFixed(0)}% de lucro bruto`}
          variant="default"
        />
      </div>
    </SectionCard>
  );
}
