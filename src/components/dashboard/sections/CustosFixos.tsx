import { Building2 } from 'lucide-react';
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

export function CustosFixos({ data, calculated, updateField }: Props) {
  return (
    <SectionCard title="7. CUSTOS FIXOS MENSAIS" icon={<Building2 className="w-5 h-5" />}>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <InputField
          label="Aluguel"
          value={data.custo_aluguel}
          onChange={(v) => updateField('custo_aluguel', v as number)}
          prefix="R$"
        />
        <InputField
          label="Salários"
          value={data.custo_salarios}
          onChange={(v) => updateField('custo_salarios', v as number)}
          prefix="R$"
        />
        <InputField
          label="Encargos"
          value={data.custo_encargos}
          onChange={(v) => updateField('custo_encargos', v as number)}
          prefix="R$"
        />
        <InputField
          label="Água/Luz"
          value={data.custo_agua_luz}
          onChange={(v) => updateField('custo_agua_luz', v as number)}
          prefix="R$"
        />
        <InputField
          label="Internet"
          value={data.custo_internet}
          onChange={(v) => updateField('custo_internet', v as number)}
          prefix="R$"
        />
        <InputField
          label="Contador"
          value={data.custo_contador}
          onChange={(v) => updateField('custo_contador', v as number)}
          prefix="R$"
        />
        <InputField
          label="Embalagens"
          value={data.custo_embalagens}
          onChange={(v) => updateField('custo_embalagens', v as number)}
          prefix="R$"
        />
        <InputField
          label="Sistema"
          value={data.custo_sistema}
          onChange={(v) => updateField('custo_sistema', v as number)}
          prefix="R$"
        />
        <InputField
          label="Marketing"
          value={data.custo_marketing}
          onChange={(v) => updateField('custo_marketing', v as number)}
          prefix="R$"
        />
        <InputField
          label="Outros"
          value={data.custo_outros}
          onChange={(v) => updateField('custo_outros', v as number)}
          prefix="R$"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          title="Total Mensal"
          value={formatCurrency(calculated.custo_fixo_mensal)}
          variant="warning"
        />
        <MetricCard
          title="Total no Ciclo (6 meses)"
          value={formatCurrency(calculated.custo_fixo_ciclo)}
          variant="warning"
        />
      </div>
    </SectionCard>
  );
}
