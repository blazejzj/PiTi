import { ID } from "appwrite";
import { 
    tables,
    DB_ID,
    COL_FOOD_ITEM,
    COL_MEAL_ITEM
} from "../../../services/appwrite/appwrite";
import type { FoodItem, MealItem } from "../models"; 

// Saves a new food item to the food_item table (for custom food entry)
export async function createFoodItem(
    userId: string,
    data: Omit<FoodItem, '$id' | 'userId' | '$createdAt' | '$updatedAt'>
): Promise<FoodItem> {
    const created = await tables.createRow({
        databaseId: DB_ID,
        tableId: COL_FOOD_ITEM,
        rowId: ID.unique(), 
        data: { 
            userId: userId, 
            ...data 
        } as Record<string, any>,
    });
    return created as unknown as FoodItem;
}

// Saves a single food log entry to the meal_item table
export async function createMealItem(
    data: Omit<MealItem, '$id' | '$createdAt' | '$updatedAt'>
): Promise<MealItem> {
    const created = await tables.createRow({
        databaseId: DB_ID,
        tableId: COL_MEAL_ITEM,
        rowId: ID.unique(), 
        data: data as Record<string, any>,
    });
    return created as unknown as MealItem;
}

// **??Saves multiple meal items in one go (for AddMealScreen submission)
export async function createMealItemsBatch(
    mealItems: Omit<MealItem, '$id' | '$createdAt' | '$updatedAt'>[]
): Promise<MealItem[]> {
    const promises = mealItems.map(item => createMealItem(item));
    return Promise.all(promises);
}