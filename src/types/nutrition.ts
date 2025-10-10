export interface FoodItem {
  name: string;
  kcal: number;
}

export interface Meal {
  id: string; 
  name: string;
  time: string;
  foodItems: FoodItem[]; 
  totalKcal: number;
  carbs: number;
  protein: number;
  fat: number;
}