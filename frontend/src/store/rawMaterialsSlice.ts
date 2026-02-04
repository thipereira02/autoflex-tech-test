import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { rawMaterialService } from '../services/rawMaterialService';
import type { RawMaterial } from '../types/rawMaterial';

interface RawMaterialsState {
  items: RawMaterial[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RawMaterialsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchRawMaterials = createAsyncThunk('rawMaterials/fetch', async () => {
  return await rawMaterialService.getAll();
});

export const addRawMaterial = createAsyncThunk('rawMaterials/add', async (data: RawMaterial) => {
  return await rawMaterialService.create(data);
});

export const updateRawMaterial = createAsyncThunk('rawMaterials/update', async ({ id, data }: { id: number, data: RawMaterial }) => {
  return await rawMaterialService.update(id, data);
});

export const deleteRawMaterial = createAsyncThunk('rawMaterials/delete', async (id: number) => {
  await rawMaterialService.delete(id);
  return id;
});

const rawMaterialsSlice = createSlice({
  name: 'rawMaterials',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRawMaterials.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchRawMaterials.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Erro ao carregar insumos';
      })
      .addCase(addRawMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateRawMaterial.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteRawMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default rawMaterialsSlice.reducer;