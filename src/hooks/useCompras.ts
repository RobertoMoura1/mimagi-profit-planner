import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Compra, ParcelaCalculada, FluxoCaixaMensal, ResumoExecutivo } from '@/types/compras';
import { toast } from '@/hooks/use-toast';

export function useCompras(planejamentoId: string | null, custoFixoMensal: number, margem: number, faturamentoMensal: number) {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carregar compras
  useEffect(() => {
    if (planejamentoId) {
      loadCompras();
    } else {
      setLoading(false);
    }
  }, [planejamentoId]);

  const loadCompras = async () => {
    if (!planejamentoId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('compras')
        .select('*')
        .eq('planejamento_id', planejamentoId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        setCompras(data.map(c => ({
          id: c.id,
          planejamento_id: c.planejamento_id || undefined,
          estacao: c.estacao,
          marca: c.marca,
          valor_total: Number(c.valor_total) || 0,
          prazo_pagamento: c.prazo_pagamento || 180,
          num_entregas: c.num_entregas || 1,
          data_entrega_1: c.data_entrega_1,
          data_entrega_2: c.data_entrega_2,
          data_entrega_3: c.data_entrega_3,
          data_entrega_4: c.data_entrega_4,
          created_at: c.created_at,
          updated_at: c.updated_at,
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar compras:', error);
      toast({
        title: 'Erro ao carregar compras',
        description: 'Não foi possível carregar os dados de compras.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar compra
  const addCompra = useCallback(async (compra: Omit<Compra, 'id'>) => {
    if (!planejamentoId) return;
    
    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('compras')
        .insert({
          ...compra,
          planejamento_id: planejamentoId,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newCompra: Compra = {
          id: data.id,
          planejamento_id: data.planejamento_id || undefined,
          estacao: data.estacao,
          marca: data.marca,
          valor_total: Number(data.valor_total) || 0,
          prazo_pagamento: data.prazo_pagamento || 180,
          num_entregas: data.num_entregas || 1,
          data_entrega_1: data.data_entrega_1,
          data_entrega_2: data.data_entrega_2,
          data_entrega_3: data.data_entrega_3,
          data_entrega_4: data.data_entrega_4,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        setCompras(prev => [...prev, newCompra]);
        toast({
          title: 'Compra adicionada',
          description: 'A compra foi registrada com sucesso.',
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar compra:', error);
      toast({
        title: 'Erro ao adicionar',
        description: 'Não foi possível registrar a compra.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  }, [planejamentoId]);

  // Atualizar compra
  const updateCompra = useCallback(async (id: string, updates: Partial<Compra>) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('compras')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setCompras(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    } catch (error) {
      console.error('Erro ao atualizar compra:', error);
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar a compra.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  }, []);

  // Remover compra
  const removeCompra = useCallback(async (id: string) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('compras')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCompras(prev => prev.filter(c => c.id !== id));
      toast({
        title: 'Compra removida',
        description: 'A compra foi removida com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao remover compra:', error);
      toast({
        title: 'Erro ao remover',
        description: 'Não foi possível remover a compra.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  }, []);

  // Calcular parcelas para uma compra
  const calcularParcelas = (compra: Compra): ParcelaCalculada[] => {
    const parcelas: ParcelaCalculada[] = [];
    const entregas = [compra.data_entrega_1, compra.data_entrega_2, compra.data_entrega_3, compra.data_entrega_4]
      .slice(0, compra.num_entregas)
      .filter((d): d is string => d !== null);

    if (entregas.length === 0) return parcelas;

    const valorPorEntrega = compra.valor_total / compra.num_entregas;
    const valorPorQuinzena = valorPorEntrega / 12;

    entregas.forEach((dataEntrega, entregaIndex) => {
      const dataBase = new Date(dataEntrega);
      // Início do pagamento = entrega + 30 dias
      const inicioPagamento = new Date(dataBase);
      inicioPagamento.setDate(inicioPagamento.getDate() + 30);

      // Gerar 12 parcelas quinzenais
      for (let i = 0; i < 12; i++) {
        const dataVencimento = calcularProximaQuinzena(inicioPagamento, i);
        
        parcelas.push({
          compra_id: compra.id,
          marca: compra.marca,
          estacao: compra.estacao,
          entrega_num: entregaIndex + 1,
          parcela_num: i + 1,
          data_vencimento: dataVencimento,
          valor: valorPorQuinzena,
          mes: `${dataVencimento.getFullYear()}-${String(dataVencimento.getMonth() + 1).padStart(2, '0')}`,
        });
      }
    });

    return parcelas;
  };

  // Calcular próxima quinzena (dia 15 ou último dia do mês)
  const calcularProximaQuinzena = (dataBase: Date, quinzenasAFrente: number): Date => {
    let data = new Date(dataBase);
    
    // Ajustar para próxima quinzena
    if (data.getDate() <= 15) {
      data.setDate(15);
    } else {
      // Último dia do mês
      data = new Date(data.getFullYear(), data.getMonth() + 1, 0);
    }

    // Avançar quinzenas
    for (let i = 0; i < quinzenasAFrente; i++) {
      if (data.getDate() === 15) {
        // Próxima quinzena = último dia do mesmo mês
        data = new Date(data.getFullYear(), data.getMonth() + 1, 0);
      } else {
        // Próxima quinzena = dia 15 do próximo mês
        data = new Date(data.getFullYear(), data.getMonth() + 1, 15);
      }
    }

    return data;
  };

  // Calcular fluxo de caixa mensal
  const calcularFluxoCaixa = (): FluxoCaixaMensal[] => {
    const fluxo: Map<string, FluxoCaixaMensal> = new Map();
    
    // Gerar meses de 2025 a 2027 (3 anos)
    const meses: string[] = [];
    for (let ano = 2025; ano <= 2027; ano++) {
      for (let mes = 1; mes <= 12; mes++) {
        meses.push(`${ano}-${String(mes).padStart(2, '0')}`);
      }
    }

    // Inicializar todos os meses
    meses.forEach(mes => {
      const [ano, mesNum] = mes.split('-').map(Number);
      const data = new Date(ano, mesNum - 1, 1);
      const mesDisplay = data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      
      fluxo.set(mes, {
        mes,
        mes_display: mesDisplay.charAt(0).toUpperCase() + mesDisplay.slice(1),
        custo_compras: 0,
        custos_fixos: custoFixoMensal,
        total_saidas: custoFixoMensal,
        faturamento_necessario: 0,
        status: 'verde',
      });
    });

    // Somar parcelas por mês
    compras.forEach(compra => {
      const parcelas = calcularParcelas(compra);
      parcelas.forEach(parcela => {
        const mesData = fluxo.get(parcela.mes);
        if (mesData) {
          mesData.custo_compras += parcela.valor;
          mesData.total_saidas = mesData.custo_compras + mesData.custos_fixos;
        }
      });
    });

    // Calcular faturamento necessário e status
    const margemContribuicao = margem > 0 ? (margem - 1) / margem : 0;
    
    fluxo.forEach((mesData) => {
      mesData.faturamento_necessario = margemContribuicao > 0 
        ? mesData.total_saidas / margemContribuicao 
        : 0;
      
      // Status baseado na comparação com faturamento planejado
      const ratio = faturamentoMensal > 0 ? mesData.faturamento_necessario / faturamentoMensal : 0;
      
      if (ratio <= 0.8) {
        mesData.status = 'verde';
      } else if (ratio <= 1.0) {
        mesData.status = 'amarelo';
      } else {
        mesData.status = 'vermelho';
      }
    });

    return Array.from(fluxo.values());
  };

  // Calcular resumo executivo
  const calcularResumoExecutivo = (): ResumoExecutivo => {
    const fluxo = calcularFluxoCaixa();
    
    // Filtrar apenas meses com compras
    const mesesComCompras = fluxo.filter(m => m.custo_compras > 0);
    
    if (mesesComCompras.length === 0) {
      return {
        mes_maior_comprometimento: '-',
        valor_maximo_saida: 0,
        faturamento_planejado: faturamentoMensal,
        caixa_necessario_medio: custoFixoMensal,
        meses_criticos: [],
        alertas: [],
      };
    }

    // Encontrar mês de maior saída
    const mesMaiorSaida = mesesComCompras.reduce((prev, curr) => 
      curr.total_saidas > prev.total_saidas ? curr : prev
    );

    // Identificar meses críticos (vermelho)
    const mesesCriticos = mesesComCompras
      .filter(m => m.status === 'vermelho')
      .map(m => m.mes_display);

    // Calcular média de caixa necessário
    const mediaTotal = mesesComCompras.reduce((sum, m) => sum + m.total_saidas, 0) / mesesComCompras.length;

    // Gerar alertas
    const alertas: string[] = [];
    
    if (mesesCriticos.length > 0) {
      alertas.push(`${mesesCriticos.length} mês(es) crítico(s) identificado(s)`);
    }
    
    if (mesMaiorSaida.total_saidas > faturamentoMensal) {
      alertas.push('Pico de caixa supera o faturamento planejado');
    }

    const totalCompras = compras.reduce((sum, c) => sum + c.valor_total, 0);
    if (totalCompras > faturamentoMensal * 6) {
      alertas.push('Volume de compras pode gerar risco de caixa');
    }

    return {
      mes_maior_comprometimento: mesMaiorSaida.mes_display,
      valor_maximo_saida: mesMaiorSaida.total_saidas,
      faturamento_planejado: faturamentoMensal,
      caixa_necessario_medio: mediaTotal,
      meses_criticos: mesesCriticos,
      alertas,
    };
  };

  // Calcular custo real mensal (para usar em outros componentes)
  const getCustoRealMensal = (mes: string): number => {
    const fluxo = calcularFluxoCaixa();
    const mesData = fluxo.find(f => f.mes === mes);
    return mesData ? mesData.total_saidas : custoFixoMensal;
  };

  // Obter total comprometido
  const getTotalComprometido = (): number => {
    return compras.reduce((sum, c) => sum + c.valor_total, 0);
  };

  return {
    compras,
    loading,
    saving,
    addCompra,
    updateCompra,
    removeCompra,
    calcularParcelas,
    calcularFluxoCaixa,
    calcularResumoExecutivo,
    getCustoRealMensal,
    getTotalComprometido,
    reload: loadCompras,
  };
}
