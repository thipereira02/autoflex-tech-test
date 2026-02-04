import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import rawMaterialsReducer from './rawMaterialsSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    rawMaterials: rawMaterialsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;