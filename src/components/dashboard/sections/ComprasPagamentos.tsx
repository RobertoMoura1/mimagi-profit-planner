import { useState } from 'react';
import { SectionCard } from '../SectionCard';
import { InputField } from '../InputField';
import { Compra, defaultCompra } from '@/types/compras';
import { formatCurrency } from '@/utils/formatters';
import { Plus, Trash2, Package, Calendar, DollarSign, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  compras: Compra[];
  saving: boolean;
  addCompra: (compra: Omit<Compra, 'id'>) => void;
  updateCompra: (id: string, updates: Partial<Compra>) => void;
  removeCompra: (id: string) => void;
  totalComprometido: number;
}

export function ComprasPagamentos({ compras, saving, addCompra, updateCompra, removeCompra, totalComprometido }: Props) {
  const [novaCompra, setNovaCompra] = useState<Omit<Compra, 'id'>>(defaultCompra);
  const [showForm, setShowForm] = useState(false);

  const handleAddCompra = () => {
    if (!novaCompra.estacao || !novaCompra.marca || novaCompra.valor_total <= 0) {
      return;
    }
    addCompra(novaCompra);
    setNovaCompra(defaultCompra);
    setShowForm(false);
  };

  const calcularInfoCompra = (compra: Compra) => {
    const valorPorEntrega = compra.valor_total / compra.num_entregas;
    const valorPorQuinzena = valorPorEntrega / 12;
    
    return {
      valorPorEntrega,
      valorPorQuinzena,
      totalParcelas: compra.num_entregas * 12,
    };
  };

  return (
    <SectionCard title="Compras & Pagamentos" icon={<Package className="w-5 h-5" />}>
      {/* Resumo de compras */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-block">
          <span className="stat-label">Total Comprometido</span>
          <span className="stat-value text-accent">{formatCurrency(totalComprometido)}</span>
        </div>
        <div className="stat-block">
          <span className="stat-label">Compras Cadastradas</span>
          <span className="stat-value">{compras.length}</span>
        </div>
        <div className="stat-block">
          <span className="stat-label">Prazo Padrão</span>
          <span className="stat-value">180 dias</span>
        </div>
      </div>

      {/* Botão adicionar */}
      {!showForm && (
        <Button
          onClick={() => setShowForm(true)}
          className="mb-6 bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Compra
        </Button>
      )}

      {/* Formulário nova compra */}
      {showForm && (
        <div className="border border-border p-4 mb-6 bg-muted/30">
          <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Nova Compra
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="corporate-label">Estação</label>
              <input
                type="text"
                className="corporate-input text-left"
                placeholder="Ex: Verão 2026"
                value={novaCompra.estacao}
                onChange={(e) => setNovaCompra(prev => ({ ...prev, estacao: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="corporate-label">Marca</label>
              <input
                type="text"
                className="corporate-input text-left"
                placeholder="Ex: Marca A"
                value={novaCompra.marca}
                onChange={(e) => setNovaCompra(prev => ({ ...prev, marca: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="corporate-label">Valor Total (R$)</label>
              <input
                type="number"
                className="corporate-input"
                value={novaCompra.valor_total || ''}
                onChange={(e) => setNovaCompra(prev => ({ ...prev, valor_total: Number(e.target.value) || 0 }))}
              />
            </div>
            
            <div>
              <label className="corporate-label">Nº Entregas</label>
              <Select
                value={String(novaCompra.num_entregas)}
                onValueChange={(v) => setNovaCompra(prev => ({ ...prev, num_entregas: Number(v) }))}
              >
                <SelectTrigger className="rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Entrega</SelectItem>
                  <SelectItem value="2">2 Entregas</SelectItem>
                  <SelectItem value="3">3 Entregas</SelectItem>
                  <SelectItem value="4">4 Entregas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Datas de entrega */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[1, 2, 3, 4].slice(0, novaCompra.num_entregas).map((num) => (
              <div key={num}>
                <label className="corporate-label flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  Data Entrega {num}
                </label>
                <input
                  type="date"
                  className="corporate-input text-left"
                  value={novaCompra[`data_entrega_${num}` as keyof typeof novaCompra] as string || ''}
                  onChange={(e) => setNovaCompra(prev => ({ 
                    ...prev, 
                    [`data_entrega_${num}`]: e.target.value || null 
                  }))}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAddCompra}
              disabled={saving || !novaCompra.estacao || !novaCompra.marca || novaCompra.valor_total <= 0}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              Salvar Compra
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setNovaCompra(defaultCompra);
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Lista de compras */}
      {compras.length > 0 && (
        <div className="overflow-x-auto">
          <table className="corporate-table">
            <thead>
              <tr>
                <th>Estação</th>
                <th>Marca</th>
                <th>Valor Total</th>
                <th>Entregas</th>
                <th>Valor/Entrega</th>
                <th>Valor/Quinzena</th>
                <th>Datas Entrega</th>
                <th className="w-16">Ações</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => {
                const info = calcularInfoCompra(compra);
                const datas = [compra.data_entrega_1, compra.data_entrega_2, compra.data_entrega_3, compra.data_entrega_4]
                  .slice(0, compra.num_entregas)
                  .filter(Boolean);
                
                return (
                  <tr key={compra.id}>
                    <td className="font-medium">{compra.estacao}</td>
                    <td>{compra.marca}</td>
                    <td className="font-mono">{formatCurrency(compra.valor_total)}</td>
                    <td className="text-center">{compra.num_entregas}</td>
                    <td className="font-mono text-muted-foreground">{formatCurrency(info.valorPorEntrega)}</td>
                    <td className="font-mono text-muted-foreground">{formatCurrency(info.valorPorQuinzena)}</td>
                    <td className="text-sm">
                      {datas.map((d, i) => (
                        <span key={i} className="mr-2">
                          {d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
                        </span>
                      ))}
                    </td>
                    <td>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCompra(compra.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {compras.length === 0 && !showForm && (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nenhuma compra cadastrada.</p>
          <p className="text-sm">Clique em "Adicionar Compra" para começar.</p>
        </div>
      )}

      {/* Info sobre regras de pagamento */}
      <div className="mt-6 p-4 bg-muted/50 border border-border text-sm">
        <h5 className="font-semibold mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Regras de Pagamento
        </h5>
        <ul className="space-y-1 text-muted-foreground">
          <li>• Início do pagamento: 30 dias após cada entrega</li>
          <li>• Término do pagamento: 210 dias após cada entrega (30 + 180)</li>
          <li>• Pagamento em quinzenas fixas: dia 15 e último dia do mês</li>
          <li>• Cada entrega gera 12 parcelas quinzenais</li>
        </ul>
      </div>
    </SectionCard>
  );
}
