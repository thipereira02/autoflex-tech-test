import { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp, AlertTriangle, CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalProducts: number;
  bestOpportunityValue: number;
  productsReadyToProduce: number;
  criticalStockItems: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    bestOpportunityValue: 0,
    productsReadyToProduce: 0,
    criticalStockItems: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<DashboardStats>('/api/products/stats')
      .then(response => setStats(response.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  if (loading) {
    return <div className="p-8 text-slate-400">Carregando indicadores...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Visão Geral da Fábrica</h1>
        <p className="text-slate-500 dark:text-slate-400">Indicadores de produção em tempo real.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20 transform hover:scale-[1.02] transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingUp size={24} className="text-white" />
            </div>
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded text-blue-50">Potencial</span>
          </div>
          <div className="space-y-1">
            <p className="text-blue-100 text-sm font-medium">Melhor Oportunidade</p>
            <h3 className="text-3xl font-bold">{formatMoney(stats.bestOpportunityValue)}</h3>
            <p className="text-xs text-blue-200 mt-2">
              Se produzir o item mais rentável agora.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${stats.productsReadyToProduce > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
              <CheckCircle2 size={24} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Produtos Prontos</p>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {stats.productsReadyToProduce} <span className="text-lg text-slate-400 font-normal">/ {stats.totalProducts}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Itens com insumos suficientes.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${stats.criticalStockItems > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              <AlertTriangle size={24} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Insumos Zerados</p>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{stats.criticalStockItems}</h3>
            <p className="text-xs text-slate-400 mt-2">
              Matérias-primas esgotadas.
            </p>
          </div>
        </div>

        <Link to="/planning" className="group bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 border-dashed flex flex-col justify-center items-center text-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <Package className="text-blue-600" size={24} />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">Ver Planejamento</h3>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            Calcular produção <ArrowRight size={12} />
          </p>
        </Link>
      </div>
    </div>
  );
}