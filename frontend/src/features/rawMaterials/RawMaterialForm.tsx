import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { X, Save, Loader2 } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { addRawMaterial, updateRawMaterial } from '../../store/rawMaterialsSlice';
import type { RawMaterial } from '../../types/rawMaterial';

interface RawMaterialFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: RawMaterial;
}

export function RawMaterialForm({ onSuccess, onCancel, initialData }: RawMaterialFormProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('UN');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setQuantity(initialData.stockQuantity.toString());
      setUnit(initialData.unit || 'UN');
    }
  }, [initialData]);

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.warning('O nome é obrigatório.');
      return;
    }

    const qtdNumber = parseFloat(quantity);
    if (isNaN(qtdNumber) || qtdNumber < 0) {
      toast.warning('Quantidade inválida.');
      return;
    }

    try {
      setIsSubmitting(true);
      const data: RawMaterial = { 
        name, 
        stockQuantity: qtdNumber, 
        unit
      };

      if (initialData && initialData.id) {
        await dispatch(updateRawMaterial({ id: initialData.id, data })).unwrap();
        toast.success('Insumo atualizado com sucesso!');
      } else {
        await dispatch(addRawMaterial(data)).unwrap();
        toast.success('Insumo cadastrado com sucesso!');
      }
      onSuccess();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      toast.error('Erro ao salvar insumo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-800">
        
        <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">
            {initialData ? 'Editar Insumo' : 'Novo Insumo'}
          </h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
              placeholder="Ex: Leite"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Quantidade
              </label>
              <input
                type="number"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                placeholder="0"
              />
            </div>
            
            {/* SELETOR DE UNIDADE */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Unidade
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="UN">un (Unidade)</option>
                <option value="KG">kg (Quilogramas)</option>
                <option value="G">g (Gramas)</option>
                <option value="L">l (Litros)</option>
                <option value="ML">ml (Mililitros)</option>
                <option value="M">m (Metros)</option>
                <option value="M2">m² (Metros Quadrados)</option>
                <option value="CX">cx (Caixa)</option>
                <option value="PCT">pct (Pacote)</option>
                <option value="RL">rl (Rolo)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}