import axios from 'axios';
import type { RawMaterial } from '../types/rawMaterial';

const API_URL = '/api/raw-materials';

export const rawMaterialService = {
  getAll: async (): Promise<RawMaterial[]> => {
    const response = await axios.get<RawMaterial[]>(API_URL);
    return response.data;
  },

  create: async (data: RawMaterial): Promise<RawMaterial> => {
    const response = await axios.post<RawMaterial>(API_URL, data);
    return response.data;
  },

  update: async (id: number, data: RawMaterial): Promise<RawMaterial> => {
    const response = await axios.put<RawMaterial>(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};