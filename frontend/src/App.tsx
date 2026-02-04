import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { MainLayout } from './components/MainLayout';
import { Dashboard } from './features/dashboard/Dashboard';
import { ProductList } from './features/products/ProductList';
import { RawMaterialList } from './features/rawMaterials/RawMaterialList';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="raw-materials" element={<RawMaterialList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;