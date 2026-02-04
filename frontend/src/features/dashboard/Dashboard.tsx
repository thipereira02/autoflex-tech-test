import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, Loader2 } from 'lucide-react';
import { productService } from '../../services/productService';
import type { DashboardStats } from '../../types/dashboard';

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await productService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total em Estoque</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {stats ? formatMoney(stats.totalValue) : 'R$ 0,00'}
              </h3>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <DollarSign className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Produtos Cadastrados</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {stats?.totalProducts || 0}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Package className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-md opacity-70">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Saídas (Simulação)</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">0</h3>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-80 flex flex-col items-center justify-center text-slate-400 border-dashed border-2 dark:border-slate-700/50">
        <BarChart3 size={64} className="mx-auto mb-4 opacity-20" />
        <p className="font-medium">Gráfico de Movimentação</p>
        <span className="text-sm opacity-60 mt-1">Disponível em breve</span>
      </div>
    </div>
  );
}