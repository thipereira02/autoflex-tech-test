import { useEffect, useState } from 'react';
import { Factory, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import type { ProductionPlan } from '../../types/productionPlan';

export function ProductionPlanList() {
  const [plans, setPlans] = useState<ProductionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ProductionPlan[]>('/api/production-plan');
      setPlans(response.data);
    } catch (error) {
      console.error("Erro ao calcular plano", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Factory className="text-blue-600" /> Planejamento de Produção
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Cálculo automático baseado no estoque atual de insumos.
          </p>
        </div>
        <button 
          onClick={fetchPlan}
          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full transition-all"
          title="Recalcular"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid gap-4">
        {plans.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className={`p-3 rounded-lg ${item.maxQuantity > 0 ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'} dark:bg-slate-800`}>
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{item.productName}</h3>
                {item.maxQuantity === 0 ? (
                  <span className="text-xs font-medium text-red-500 flex items-center gap-1">
                    <AlertTriangle size={12} /> Estoque Insuficiente
                  </span>
                ) : (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Produção Disponível
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Quantidade</p>
                <p className="text-2xl font-mono font-bold text-slate-800 dark:text-white">
                  {item.maxQuantity} <span className="text-sm text-slate-400 font-normal">un</span>
                </p>
              </div>
              
              <div className="text-right pl-8 border-l border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Potencial</p>
                <p className={`text-xl font-bold ${item.maxQuantity > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300'}`}>
                  {formatMoney(item.totalValue)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {!loading && plans.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            Nenhum produto com receita cadastrada para calcular.
          </div>
        )}
      </div>
    </div>
  );
}