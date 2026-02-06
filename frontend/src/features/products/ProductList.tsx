import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Edit, Package, AlertCircle, Plus, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts, deleteProduct } from '../../store/productsSlice';
import type { Product } from '../../types/product';
import { ProductForm } from './ProductForm';

export function ProductList() {
  const dispatch = useAppDispatch();
  
  const { items: products, status, error } = useAppSelector((state) => state.products);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleDelete = (product: Product) => {
    toast.error(`Excluir "${product.name}"?`, {
      description: 'Essa ação não poderá ser desfeita.',
      action: {
        label: 'Excluir',
        onClick: async () => {
          try {
            await dispatch(deleteProduct(product.id!)).unwrap();
            toast.success('Produto removido.');
          } catch {
            toast.error('Erro ao remover produto.');
          }
        },
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => {},
      },
      duration: 5000,
    });
  };;

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = safeProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading' && safeProducts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        Carregando produtos...
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2 border border-red-200 dark:border-red-800">
        <AlertCircle size={20} />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
       <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar produtos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700 dark:text-slate-200 duration-300"
            />
          </div>
          
          <button 
            onClick={handleNew}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus size={18} />
            Novo Produto
          </button>
        </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-400 uppercase font-semibold text-xs border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Preço Venda</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                    <Package className="mx-auto h-12 w-12 mb-3 opacity-20" />
                    <p>Nenhum produto encontrado.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-300">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400 dark:text-slate-500">
                      #{product.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {product.name}
                      {product.composition && product.composition.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full font-bold uppercase tracking-wide">
                          Com Ficha
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.sellingPrice)}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" 
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" 
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <ProductForm 
          onSuccess={() => setIsFormOpen(false)} 
          onCancel={() => setIsFormOpen(false)}
          initialData={editingProduct}
        />
      )}
    </div>
  );
}