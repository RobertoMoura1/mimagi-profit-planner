// Interface para compra/pedido
export interface Compra {
  id: string;
  planejamento_id?: string;
  estacao: string;
  marca: string;
  valor_total: number;
  prazo_pagamento: number; // dias (default 180)
  num_entregas: number; // 1 a 4
  data_entrega_1: string | null;
  data_entrega_2: string | null;
  data_entrega_3: string | null;
  data_entrega_4: string | null;
  created_at?: string;
  updated_at?: string;
}

// Interface para parcela calculada
export interface ParcelaCalculada {
  compra_id: string;
  marca: string;
  estacao: string;
  entrega_num: number;
  parcela_num: number;
  data_vencimento: Date;
  valor: number;
  mes: string; // formato "YYYY-MM"
}

// Interface para fluxo de caixa mensal
export interface FluxoCaixaMensal {
  mes: string; // formato "YYYY-MM"
  mes_display: string; // formato "Jan/2026"
  custo_compras: number;
  custos_fixos: number;
  total_saidas: number;
  faturamento_necessario: number;
  status: 'verde' | 'amarelo' | 'vermelho';
}

// Interface para resumo executivo
export interface ResumoExecutivo {
  mes_maior_comprometimento: string;
  valor_maximo_saida: number;
  faturamento_planejado: number;
  caixa_necessario_medio: number;
  meses_criticos: string[];
  alertas: string[];
}

export const defaultCompra: Omit<Compra, 'id'> = {
  estacao: '',
  marca: '',
  valor_total: 0,
  prazo_pagamento: 180,
  num_entregas: 1,
  data_entrega_1: null,
  data_entrega_2: null,
  data_entrega_3: null,
  data_entrega_4: null,
};
