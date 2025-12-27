
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum Category {
  PERSONAL = 'Personal',
  BUSINESS = 'Business',
  BILLS = 'Bills',
  TAXES = 'Taxes',
  CUSTOM = 'Custom'
}

export enum BillType {
  ELECTRICITY = 'Electricity',
  WATER = 'Water',
  INTERNET = 'Internet',
  CREDIT_CARD = 'Credit Card',
  OTHER = 'Other'
}

export enum TaxType {
  BIR = 'BIR Deadline',
  QUARTERLY = 'Quarterly Tax',
  ANNUAL = 'Annual Tax',
  LGU = 'LGU Payment',
  OTHER = 'Other'
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  category: Category;
  subType?: BillType | TaxType | string;
  priority: Priority;
  dueDate: string;
  isCompleted: boolean;
  recurring?: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  createdAt: string;
}

export interface SummaryData {
  total: number;
  completed: number;
  overdue: number;
  upcoming: number;
}
