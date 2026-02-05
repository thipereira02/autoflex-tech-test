import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductionPlanList } from '../features/production/ProductionPlanList';
import axios from 'axios';

vi.mock('axios');

describe('ProductionPlanList Component', () => {
  
  it('It should render the production cards when there is data.', async () => {
    const mockData = [
      {
        productName: "Produto Teste",
        maxQuantity: 10,
        totalValue: 500.0
      }
    ];

    (axios.get as any).mockResolvedValue({ data: mockData });

    render(<ProductionPlanList />);

    expect(screen.getByText(/Planejamento de Produção/i)).toBeInTheDocument();

    await waitFor(() => {
        expect(screen.getByText("Produto Teste")).toBeInTheDocument();
        
        expect(screen.getByText("Produção Disponível")).toBeInTheDocument();
        expect(screen.getByText("Quantidade")).toBeInTheDocument(); 
        expect(screen.getByText("Potencial")).toBeInTheDocument();
        
        expect(screen.getByText("10")).toBeInTheDocument();
        expect(screen.getByText(/500,00/)).toBeInTheDocument();
    });
  });
});