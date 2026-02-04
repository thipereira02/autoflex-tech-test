import { useState, useEffect } from 'react';
import { X, Save, Loader2, Plus, Trash2, ChefHat } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addProduct, updateProduct } from '../../store/productsSlice';
import { fetchRawMaterials } from '../../store/rawMaterialsSlice';
import type { Product, ProductComposition } from '../../types/product';

interface ProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: Product;
}

export function ProductForm({ onSuccess, onCancel, initialData }: ProductFormProps) {
  const dispatch = useAppDispatch();
  
  const { items: rawMaterials } = useAppSelector((state) => state.rawMaterials);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [composition, setComposition] = useState<ProductComposition[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchRawMaterials());

    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.sellingPrice.toString());
      if (initialData.composition) {
        setComposition(initialData.composition);
      }
    }
  }, [initialData, dispatch]);

  const handleAddIngredient = () => {
    if (rawMaterials.length === 0) return;
    
    setComposition([
      ...composition, 
      { rawMaterial: rawMaterials[0], requiredQuantity: 1 }
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    const newList = [...composition];
    newList.splice(index, 1);
    setComposition(newList);
  };

  const handleIngredientChange = (index: number, field: 'rawMaterial' | 'requiredQuantity', value: any) => {
    const newList = [...composition];
    
    if (field === 'rawMaterial') {
      const selected = rawMaterials.find(rm => rm.id === Number(value));
      if (selected) newList[index].rawMaterial = selected;
    } else {
      newList[index].requiredQuantity = parseFloat(value) || 0;
    }
    
    setComposition(newList);
  };

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Nome é obrigatório');
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) return setError('Preço inválido');

    const invalidIngredients = composition.some(c => c.requiredQuantity <= 0);
    if (invalidIngredients) return setError('Existem ingredientes com quantidade zero ou negativa.');

    try {
      setIsSubmitting(true);
      
      const productData: Product = {
        name,
        sellingPrice: priceNum,
        composition: composition
      };

      if (initialData && initialData.id) {
        await dispatch(updateProduct({ id: initialData.id, data: productData })).unwrap();
      } else {
        await dispatch(addProduct(productData)).unwrap();
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar produto.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 flex flex-col">
        
        <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 z-10">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
            {initialData ? 'Editar Produto' : 'Novo Produto'}
          </h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Produto</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                placeholder="Ex: Bolo de Chocolate"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preço de Venda (R$)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                placeholder="0.00"
              />
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <ChefHat className="text-blue-600" size={20} />
                <h4 className="font-semibold">Ficha Técnica / Receita</h4>
              </div>
              <button
                type="button"
                onClick={handleAddIngredient}
                disabled={rawMaterials.length === 0}
                className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                Adicionar Ingrediente
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 min-h-[100px]">
              {rawMaterials.length === 0 ? (
                <p className="text-sm text-yellow-600 dark:text-yellow-500 text-center py-2">
                  Nenhuma matéria-prima cadastrada. Cadastre insumos antes de criar a receita.
                </p>
              ) : composition.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4 italic">
                  Nenhum ingrediente adicionado. Clique acima para começar.
                </p>
              ) : (
                composition.map((item, index) => (
                  <div key={index} className="flex gap-2 items-start animate-in slide-in-from-left-2 duration-200">
                    <div className="flex-1">
                      <select
                        value={item.rawMaterial.id}
                        onChange={(e) => handleIngredientChange(index, 'rawMaterial', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                      >
                        {rawMaterials.map(rm => (
                          <option key={rm.id} value={rm.id}>
                            {rm.name} ({rm.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-24 relative">
                      <input
                        type="number"
                        step="0.001"
                        value={item.requiredQuantity}
                        onChange={(e) => handleIngredientChange(index, 'requiredQuantity', e.target.value)}
                        className="w-full pl-3 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                        placeholder="Qtd"
                      />
                      <span className="absolute right-2 top-2 text-xs text-slate-400 pointer-events-none">
                        {item.rawMaterial.unit}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remover ingrediente"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 mt-4 py-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Salvar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}