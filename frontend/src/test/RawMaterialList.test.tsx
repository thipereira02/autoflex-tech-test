import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RawMaterialList } from '../features/rawMaterials/RawMaterialList';

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
  useSelector: (selector: any) => selector({
    rawMaterials: {
      items: [
        { 
            id: 1, 
            name: "Plástico Teste", 
            stockQuantity: 500, 
            unit: "KG" 
        }
      ],
      status: 'succeeded',
      error: null
    }
  })
}));

describe('RawMaterialList Component', () => {
  
  it('deve renderizar a lista de matérias-primas vinda do Redux', async () => {
    render(<RawMaterialList />);

    expect(screen.getByText("Novo Insumo")).toBeInTheDocument();
    expect(screen.getByText("Nome do Insumo")).toBeInTheDocument();

    await waitFor(() => {
        expect(screen.getByText("Plástico Teste")).toBeInTheDocument();
        expect(screen.getByText("500")).toBeInTheDocument();
        expect(screen.getByText("KG")).toBeInTheDocument();
    });
  });
});