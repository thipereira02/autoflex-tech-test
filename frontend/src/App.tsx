import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/ThemeProvider';
import { MainLayout } from './components/MainLayout';
import { Dashboard } from './features/dashboard/Dashboard';
import { ProductList } from './features/products/ProductList';
import { RawMaterialList } from './features/rawMaterials/RawMaterialList';
import { ProductionPlanList } from './features/production/ProductionPlanList';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors expand={true} />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="raw-materials" element={<RawMaterialList />} />
            <Route path="planning" element={<ProductionPlanList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;