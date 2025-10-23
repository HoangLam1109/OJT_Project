export interface Reagent {
  id: string;
  name: string;
  lotNumber: string;
  manufacturer: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  storageTemp: string;
  status: 'available' | 'low_stock' | 'expired' | 'out_of_stock';
  minimumStock: number;
  costPerUnit: number;
  location: string;
}   