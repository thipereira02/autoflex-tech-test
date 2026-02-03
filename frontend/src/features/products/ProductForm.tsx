import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { productService } from '../../services/productService';
import type { Product } from '../../types/product';

interface ProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ onSuccess, onCancel }: ProductFormProps) {
  const [name, setName] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('O nome do produto é obrigatório.');
      return;
    }

    const priceNumber = parseFloat(sellingPrice.replace(',', '.'));
    if (isNaN(priceNumber) || priceNumber <= 0) {
      setError('Informe um preço válido maior que zero.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const newProduct: Product = {
        name: name,
        sellingPrice: priceNumber
      };

      await productService.create(newProduct);
      
      onSuccess();
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar produto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 text-lg">Novo Produto</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              Nome do Produto
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ex: Teclado Mecânico"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">
              Preço de Venda (R$)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0,00"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors font-medium text-sm"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Salvar Produto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}