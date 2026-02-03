import { ProductList } from './features/products/ProductList';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          Autoflex Stock Manager 🚀
        </h1>
        
        <ProductList />
      </div>
    </div>
  );
}

export default App;