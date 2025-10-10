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
  },
  { id: '3', name: 'Snack', time: '15.00',
    totalKcal: 200, carbs: 25, protein: 5, fat: 8,
    foodItems: [{ name: 'Yogurt', kcal: 100 }, { name: 'Fruit', kcal: 100 }]
  },
  { id: '4', name: 'Dinner', time: '18.00',
    totalKcal: 700, carbs: 80, protein: 40, fat: 25,
    foodItems: [{ name: 'Salmon', kcal: 400 }, { name: 'Potatoes', kcal: 200 }, { name: 'Salad', kcal: 100 }]
  },
];