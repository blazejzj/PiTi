import { Meal } from '../types/nutrition';

export const DummyMeals: Meal[] = [
  
  {
    id: '1', name: 'Breakfast', time: '8.00',
    totalKcal: 330, carbs: 45, protein: 15, fat: 10,
    foodItems: [{ name: 'Cornflakes', kcal: 300 }, { name: 'Milk', kcal: 30 }]
  },
    { id: '2', name: 'Lunch', time: '12.00',
    totalKcal: 600, carbs: 70, protein: 30, fat: 20,
    foodItems: [{ name: 'Chicken', kcal: 300 }, { name: 'Rice', kcal: 200 }, { name: 'Vegetables', kcal: 100 }]
  }
];