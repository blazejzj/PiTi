export type FoodItem = {
    $id: string; 
    userId: string; 
    name: string;
    barcode: string; 
    kcalPer100g: number | null;
    carbPer100g: number | null;
    fatPer100g: number | null;
    proteinPer100g: number | null;
    $createdAt: string;
    $updatedAt: string;
};

export type MealItem = {
    $id: string;
    mealId: string;
    foodItemId: string;
    amountG?: number | null;
    kcal: number | null;
    carbG: number | null;
    fatG: number | null;
    proteinG: number | null;
    $createdAt: string;
    $updatedAt: string;
};

// **one logged food instance within a meal for display purposes
export type LoggedFoodItemDisplay = {
    mealItemId: string; 
    name: string; 
    amountG: number; 
    kcal: number;
};

// **structure of a complete meal for display purposes
export type Meal = {
    id: string; 
    name: string; 
    type?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'; 
    time?: string; 
    totalKcal: number; 
    carbs: number;
    protein: number;
    fat: number;
    foodItems: LoggedFoodItemDisplay[]; 
};