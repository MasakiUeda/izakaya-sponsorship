export interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  targetAmount: number;
  currentAmount: number;
  isActive: boolean;
}

