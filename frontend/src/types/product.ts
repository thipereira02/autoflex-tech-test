import type { RawMaterial } from "./rawMaterial";

export interface ProductComposition {
  id?: number;
  rawMaterial: RawMaterial;
  requiredQuantity: number;
}

export interface Product {
  id?: number;
  name: string;
  description?: string;
  sellingPrice: number;
  composition?: ProductComposition[];
}