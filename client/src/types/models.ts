export interface Transaction {
  transaction_id: string;
  category_id: string;
  amount: number;
  description: string;
  transaction_date: string;
  transaction_type: string;
  user_id?: string;
}

export interface Settings {
  settings_id: string;
  category_id: string;
  amount: number;
  description: string;
  transaction_type: string;
  month?: number;
  year?: number;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  budget?: number;
}

export interface SavingGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  color?: string;
}

export interface SidebarContextType {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}
