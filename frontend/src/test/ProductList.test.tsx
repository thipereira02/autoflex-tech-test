import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductList } from '../features/products/ProductList';

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
  useSelector: (selector: any) => selector({
    products: {
      items: [
        { 
            id: 1, 
            name: "Cadeira Gamer Teste", 
            sellingPrice: 1200.50 
        }
      ],
      status: 'succeeded',
      error: null
    }
  })
}));

describe('ProductList Component', () => {
  
  it('It should render the product list coming from Redux.', async () => {
    render(<ProductList />);

    expect(screen.getByText("Preço Venda")).toBeInTheDocument();
    
    expect(screen.getByText("Novo Produto")).toBeInTheDocument();

    await waitFor(() => {
        expect(screen.getByText("Cadeira Gamer Teste")).toBeInTheDocument();
        expect(screen.getByText(/1\.200,50/)).toBeInTheDocument(); 
    });
  });
});