import axios from 'axios';
import type { Product } from '../types/product';

const API_URL = '/api/products';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await axios.get<Product[]>(API_URL);
    return response.data;
  },

  create: async (product: Product): Promise<Product> => {
    const response = await axios.post<Product>(API_URL, product);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};