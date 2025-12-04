import { SectionCard } from '../SectionCard';
import { InputField } from '../InputField';
import { AlertBox } from '../AlertBox';
import { PlanejamentoFinanceiro, CalculatedValues, Alert } from '@/types/financial';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PlanejamentoCanaisProps {
  data: PlanejamentoFinanceiro;
  calculated: CalculatedValues;
  updateField: <K extends keyof PlanejamentoFinanceiro>(field: K, value: PlanejamentoFinanceiro[K]) => void;
}

interface CanalData {
  nome: string;
  perc: number;
  ticket: number;
  invest?: number;
  cpv?: number;
  conv?: number;
  hasInvest: boolean;
}

const COLORS = ['#1e4d4d', '#2d6b6b', '#3d8989', '#4da7a7', '#5dc5c5', '#6de3e3', '#7dffff'];

export function PlanejamentoCanais({ data, calculated, updateField }: PlanejamentoCanaisProps) {
  const faturamentoMensal = calculated.faturamento_mensal;
  
  // Dados dos canais
  const canais: CanalData[] = [
    { nome: 'Loja Física', perc: data.canal_loja_fisica_perc, ticket: data.ticket_loja_fisica, hasInvest: false },
    { nome: 'Instagram Ads', perc: data.canal_instagram_ads_perc, ticket: data.ticket_instagram_ads, invest: data.invest_instagram_ads, cpv: data.cpv_instagram_ads, conv: data.conv_instagram_ads, hasInvest: true },
    { nome: 'Instagram Orgânico', perc: data.canal_instagram_organico_perc, ticket: data.ticket_instagram_ads, hasInvest: false },
    { nome: 'WhatsApp', perc: data.canal_whatsapp_perc, ticket: data.ticket_whatsapp, invest: data.invest_whatsapp, cpv: data.cpv_whatsapp, conv: data.conv_whatsapp, hasInvest: true },
    { nome: 'Shopee', perc: data.canal_shopee_perc, ticket: data.ticket_shopee, invest: data.invest_shopee, cpv: data.cpv_shopee, conv: data.conv_shopee, hasInvest: true },
    { nome: 'Indicações/Recorrência', perc: data.canal_indicacoes_perc, ticket: data.ticket_loja_fisica, hasInvest: false },
    { nome: 'Eventos/Ações', perc: data.canal_eventos_perc, ticket: data.ticket_loja_fisica, hasInvest: false },
  ];

  // Soma dos percentuais
  const somaPerc = canais.reduce((acc, c) => acc + c.perc, 0);
  const distribuicaoValida = Math.abs(somaPerc - 100) <= 0.01;

  // Investimento total
  const investimentoTotal = data.invest_instagram_ads + data.invest_promocoes + data.invest_whatsapp + 
                            data.invest_shopee + data.invest_influenciadores + data.invest_outros;

  // Cálculos por canal
  const canaisCalculados = canais.map(canal => {
    const faturamentoEsperado = faturamentoMensal * (canal.perc / 100);
    const pecasNecessarias = canal.ticket > 0 ? Math.ceil(faturamentoEsperado / canal.ticket) : 0;
    const roas = canal.invest && canal.invest > 0 ? faturamentoEsperado / canal.invest : null;
    const vendasParaPagarInvest = canal.invest && canal.ticket > 0 ? Math.ceil(canal.invest / canal.ticket) : null;
    
    let status: 'verde' | 'amarelo' | 'vermelho' = 'verde';
    if (roas !== null) {
      if (roas < 1) status = 'vermelho';
      else if (roas < 3) status = 'amarelo';
    }
    
    return {
      ...canal,
      faturamentoEsperado,
      pecasNecessarias,
      roas,
      vendasParaPagarInvest,
      status,
    };
  });

  // Dados para gráfico de pizza
  const pieData = canaisCalculados.map(c => ({
    name: c.nome,
    value: c.faturamentoEsperado,
    perc: c.perc,
  }));

  // Dados para gráfico de barras
  const barData = canaisCalculados.filter(c => c.hasInvest && c.invest).map(c => ({
    name: c.nome.length > 12 ? c.nome.substring(0, 12) + '...' : c.nome,
    investimento: c.invest || 0,
    faturamento: c.faturamentoEsperado,
  }));

  // Alertas
  const alertasCanais: Alert[] = [];
  
  if (!distribuicaoValida) {
    alertasCanais.push({ type: 'danger', message: `A soma da participação dos canais é ${somaPerc.toFixed(1)}%. Deve ser 100%.` });
  }
  
  canaisCalculados.forEach(c => {
    if (c.roas !== null && c.roas < 1) {
      alertasCanais.push({ type: 'danger', message: `ROAS do canal ${c.nome} está abaixo de 1 (${c.roas.toFixed(2)}). Investimento não se paga.` });
    } else if (c.roas !== null && c.roas < 3) {
      alertasCanais.push({ type: 'warning', message: `ROAS do canal ${c.nome} está entre 1 e 3 (${c.roas.toFixed(2)}). Atenção ao retorno.` });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verde': return 'text-green-600 bg-green-50';
      case 'amarelo': return 'text-yellow-600 bg-yellow-50';
      case 'vermelho': return 'text-red-600 bg-red-50';
      default: return '';
    }
  };

  // Sugestões de conteúdo
  const sugestoesConteudo = [
    { canal: 'Instagram Ads', formato: 'Reels + Carrossel', objetivo: 'Conversão', meta: 'Testar 10 criativos/semana' },
    { canal: 'Instagram Orgânico', formato: 'Reels + Stories', objetivo: 'Engajamento', meta: '3 reels + 15 stories/semana' },
    { canal: 'Loja Física', formato: 'Ações presenciais', objetivo: 'Experiência', meta: '3 ativações semanais' },
    { canal: 'WhatsApp', formato: 'Lista + Broadcast', objetivo: 'Relacionamento', meta: '1 lista + 1 broadcast/semana' },
    { canal: 'Shopee', formato: 'Otimização anúncios', objetivo: 'Visibilidade', meta: 'Otimizar 5 anúncios/semana' },
  ];

  return (
    <div className="space-y-6">
      <SectionCard title="13. PLANEJAMENTO POR CANAIS DE VENDA">
        {/* Alertas */}
        {alertasCanais.length > 0 && (
          <div className="mb-6">
            <AlertBox alerts={alertasCanais} />
          </div>
        )}

        {/* Inputs de Distribuição */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
            Distribuição de Faturamento por Canal (%)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <InputField label="Loja Física (%)" value={data.canal_loja_fisica_perc} onChange={v => updateField('canal_loja_fisica_perc', Number(v))} suffix="%" />
            <InputField label="Instagram Ads (%)" value={data.canal_instagram_ads_perc} onChange={v => updateField('canal_instagram_ads_perc', Number(v))} suffix="%" />
            <InputField label="Insta Orgânico (%)" value={data.canal_instagram_organico_perc} onChange={v => updateField('canal_instagram_organico_perc', Number(v))} suffix="%" />
            <InputField label="WhatsApp (%)" value={data.canal_whatsapp_perc} onChange={v => updateField('canal_whatsapp_perc', Number(v))} suffix="%" />
            <InputField label="Shopee (%)" value={data.canal_shopee_perc} onChange={v => updateField('canal_shopee_perc', Number(v))} suffix="%" />
            <InputField label="Indicações (%)" value={data.canal_indicacoes_perc} onChange={v => updateField('canal_indicacoes_perc', Number(v))} suffix="%" />
            <InputField label="Eventos (%)" value={data.canal_eventos_perc} onChange={v => updateField('canal_eventos_perc', Number(v))} suffix="%" />
          </div>
          <div className={`mt-2 text-sm font-medium ${distribuicaoValida ? 'text-green-600' : 'text-red-600'}`}>
            Total: {somaPerc.toFixed(1)}% {!distribuicaoValida && '(deve ser 100%)'}
          </div>
        </div>

        {/* Investimentos por Canal */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
            Investimento Previsto por Canal (R$)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <InputField label="Instagram Ads" value={data.invest_instagram_ads} onChange={v => updateField('invest_instagram_ads', Number(v))} prefix="R$" />
            <InputField label="Promoções" value={data.invest_promocoes} onChange={v => updateField('invest_promocoes', Number(v))} prefix="R$" />
            <InputField label="WhatsApp" value={data.invest_whatsapp} onChange={v => updateField('invest_whatsapp', Number(v))} prefix="R$" />
            <InputField label="Shopee (taxas)" value={data.invest_shopee} onChange={v => updateField('invest_shopee', Number(v))} prefix="R$" />
            <InputField label="Influenciadores" value={data.invest_influenciadores} onChange={v => updateField('invest_influenciadores', Number(v))} prefix="R$" />
            <InputField label="Outros" value={data.invest_outros} onChange={v => updateField('invest_outros', Number(v))} prefix="R$" />
          </div>
          <div className="mt-2 text-sm font-medium text-foreground">
            Total Investimento: {formatCurrency(investimentoTotal)}
          </div>
        </div>

        {/* Ticket Médio por Canal */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
            Ticket Médio por Canal (R$)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InputField label="Loja Física" value={data.ticket_loja_fisica} onChange={v => updateField('ticket_loja_fisica', Number(v))} prefix="R$" />
            <InputField label="Instagram Ads" value={data.ticket_instagram_ads} onChange={v => updateField('ticket_instagram_ads', Number(v))} prefix="R$" />
            <InputField label="WhatsApp" value={data.ticket_whatsapp} onChange={v => updateField('ticket_whatsapp', Number(v))} prefix="R$" />
            <InputField label="Shopee" value={data.ticket_shopee} onChange={v => updateField('ticket_shopee', Number(v))} prefix="R$" />
          </div>
        </div>

        {/* CPV e Conversão */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
              Custo por Venda Estimado (R$)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <InputField label="Instagram Ads" value={data.cpv_instagram_ads} onChange={v => updateField('cpv_instagram_ads', Number(v))} prefix="R$" />
              <InputField label="WhatsApp" value={data.cpv_whatsapp} onChange={v => updateField('cpv_whatsapp', Number(v))} prefix="R$" />
              <InputField label="Shopee" value={data.cpv_shopee} onChange={v => updateField('cpv_shopee', Number(v))} prefix="R$" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
              Taxa de Conversão Estimada (%)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <InputField label="Instagram Ads" value={data.conv_instagram_ads} onChange={v => updateField('conv_instagram_ads', Number(v))} suffix="%" step={0.1} />
              <InputField label="WhatsApp" value={data.conv_whatsapp} onChange={v => updateField('conv_whatsapp', Number(v))} suffix="%" step={0.1} />
              <InputField label="Shopee" value={data.conv_shopee} onChange={v => updateField('conv_shopee', Number(v))} suffix="%" step={0.1} />
            </div>
          </div>
        </div>

        {/* Tabela 1 - Distribuição de Faturamento */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
            Tabela: Distribuição de Faturamento por Canal
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left p-3 font-semibold">Canal</th>
                  <th className="text-right p-3 font-semibold">% Fat.</th>
                  <th className="text-right p-3 font-semibold">Fat. Esperado</th>
                  <th className="text-right p-3 font-semibold">Ticket Médio</th>
                  <th className="text-right p-3 font-semibold">Peças Necessárias</th>
                  <th className="text-center p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {canaisCalculados.map((canal, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3 font-medium">{canal.nome}</td>
                    <td className="text-right p-3 font-mono">{formatPercent(canal.perc)}</td>
                    <td className="text-right p-3 font-mono">{formatCurrency(canal.faturamentoEsperado)}</td>
                    <td className="text-right p-3 font-mono">{formatCurrency(canal.ticket)}</td>
                    <td className="text-right p-3 font-mono">{canal.pecasNecessarias}</td>
                    <td className="text-center p-3">
                      <span className={`px-2 py-1 text-xs font-semibold ${getStatusColor(canal.status)}`}>
                        {canal.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/50 font-semibold">
                  <td className="p-3">TOTAL</td>
                  <td className="text-right p-3 font-mono">{formatPercent(somaPerc)}</td>
                  <td className="text-right p-3 font-mono">{formatCurrency(faturamentoMensal)}</td>
                  <td className="text-right p-3 font-mono">-</td>
                  <td className="text-right p-3 font-mono">{canaisCalculados.reduce((acc, c) => acc + c.pecasNecessarias, 0)}</td>
                  <td className="text-center p-3">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabela 2 - Investimento por Canal */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
            Tabela: Investimento vs Retorno por Canal
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left p-3 font-semibold">Canal</th>
                  <th className="text-right p-3 font-semibold">Investimento</th>
                  <th className="text-right p-3 font-semibold">CPV Estimado</th>
                  <th className="text-right p-3 font-semibold">Vendas p/ Pagar Invest.</th>
                  <th className="text-right p-3 font-semibold">ROAS Estimado</th>
                  <th className="text-left p-3 font-semibold">Observações</th>
                </tr>
              </thead>
              <tbody>
                {canaisCalculados.filter(c => c.hasInvest).map((canal, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3 font-medium">{canal.nome}</td>
                    <td className="text-right p-3 font-mono">{formatCurrency(canal.invest || 0)}</td>
                    <td className="text-right p-3 font-mono">{canal.cpv ? formatCurrency(canal.cpv) : '-'}</td>
                    <td className="text-right p-3 font-mono">{canal.vendasParaPagarInvest || '-'}</td>
                    <td className="text-right p-3">
                      <span className={`px-2 py-1 text-xs font-semibold font-mono ${getStatusColor(canal.status)}`}>
                        {canal.roas ? canal.roas.toFixed(2) : '-'}
                      </span>
                    </td>
                    <td className="text-left p-3 text-xs text-muted-foreground">
                      {canal.roas && canal.roas >= 3 ? 'ROAS saudável' : canal.roas && canal.roas >= 1 ? 'Atenção ao retorno' : canal.roas ? 'Investimento não se paga' : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Pizza */}
          <div className="bg-muted/30 p-4">
            <h4 className="text-sm font-semibold text-foreground mb-4">Participação dos Canais no Faturamento</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, perc }) => `${name.substring(0, 8)}... ${perc.toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Barras */}
          <div className="bg-muted/30 p-4">
            <h4 className="text-sm font-semibold text-foreground mb-4">Investimento vs Faturamento Esperado</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="investimento" fill="#1e4d4d" name="Investimento" />
                <Bar dataKey="faturamento" fill="#4da7a7" name="Faturamento" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </SectionCard>

      {/* Seção de Conteúdos */}
      <SectionCard title="13.1 PLANEJAMENTO DE CONTEÚDOS POR CANAL">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
            Conteúdos Semanais por Canal
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <InputField label="Reels Ads" value={data.conteudo_reels_ads} onChange={v => updateField('conteudo_reels_ads', Number(v))} />
            <InputField label="Criativos Tráfego" value={data.conteudo_criativos_trafego} onChange={v => updateField('conteudo_criativos_trafego', Number(v))} />
            <InputField label="Stories/Dia" value={data.conteudo_stories_dia} onChange={v => updateField('conteudo_stories_dia', Number(v))} />
            <InputField label="Posts/Semana" value={data.conteudo_posts_semana} onChange={v => updateField('conteudo_posts_semana', Number(v))} />
            <InputField label="Ações Loja" value={data.conteudo_acoes_loja} onChange={v => updateField('conteudo_acoes_loja', Number(v))} />
            <InputField label="WhatsApp" value={data.conteudo_whatsapp} onChange={v => updateField('conteudo_whatsapp', Number(v))} />
            <InputField label="Shopee" value={data.conteudo_shopee} onChange={v => updateField('conteudo_shopee', Number(v))} />
          </div>
        </div>

        {/* Tabela de Sugestões */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
            Sugestões de Conteúdo por Canal
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left p-3 font-semibold">Canal</th>
                  <th className="text-left p-3 font-semibold">Melhor Formato</th>
                  <th className="text-left p-3 font-semibold">Objetivo</th>
                  <th className="text-left p-3 font-semibold">Meta Sugerida</th>
                </tr>
              </thead>
              <tbody>
                {sugestoesConteudo.map((sug, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3 font-medium">{sug.canal}</td>
                    <td className="p-3">{sug.formato}</td>
                    <td className="p-3">{sug.objetivo}</td>
                    <td className="p-3 text-accent font-medium">{sug.meta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}