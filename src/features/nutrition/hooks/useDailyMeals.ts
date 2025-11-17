import { useEffect, useState, useCallback } from "react";
import { account } from "../../../services/appwrite/appwrite";
import { mealRepo } from "../repository/mealRepo";
import { mealItemRepo } from "../repository/mealItemRepo";
import { foodItemRepo } from "../repository/foodItemRepo";
import type {
    Meal,
    MealRow,
    MealItem,
    FoodItem,
    LoggedFoodItemDisplay,
} from "../models";

type DailyMealsState = {
    meals: Meal[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    deleteMeal: (mealId: string) => Promise<void>;
};

const buildLoggedItems = (
    items: MealItem[],
    foodMap: Record<string, FoodItem>
): LoggedFoodItemDisplay[] =>
    items.map((it) => {
        const fi = foodMap[it.foodItemId];
        return {
            mealItemId: it.$id,
            name: fi?.name ?? "Unknown food",
            amountG: it.amountG ?? 0,
            kcal: Math.round(it.kcal ?? 0),
        };
    });

const mapToViewMeal = (
    mealRow: MealRow,
    items: MealItem[],
    foodMap: Record<string, FoodItem>
): Meal => {
    const totals = items.reduce(
        (acc, it) => {
            acc.kcal += it.kcal ?? 0;
            acc.carbs += it.carbG ?? 0;
            acc.protein += it.proteinG ?? 0;
            acc.fat += it.fatG ?? 0;
            return acc;
        },
        { kcal: 0, carbs: 0, protein: 0, fat: 0 }
    );

    return {
        id: mealRow.$id,
        name: mealRow.name,
        type: mealRow.type,
        time: mealRow.timeISO,
        totalKcal: Math.round(totals.kcal),
        carbs: Math.round(totals.carbs),
        protein: Math.round(totals.protein),
        fat: Math.round(totals.fat),
        foodItems: buildLoggedItems(items, foodMap),
    };
};

export function useDailyMeals(dateISO: string): DailyMealsState {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const user = await account.get();
            const mealRows: MealRow[] = await mealRepo.listByDate(
                user.$id,
                dateISO
            );

            // get all meal items for each meal
            const allMealItemsPerMeal: MealItem[][] = await Promise.all(
                mealRows.map((m) => mealItemRepo.listByMeal(m.$id)) // MealItem[] that is
            );

            const allFoodItemIds = Array.from(
                new Set(
                    allMealItemsPerMeal
                        .flat()
                        .map((it) => it.foodItemId)
                        .filter(Boolean)
                )
            );

            // get foodItems once
            const foodItems: FoodItem[] =
                allFoodItemIds.length > 0
                    ? await foodItemRepo.listByIds(allFoodItemIds)
                    : [];
            const foodMap: Record<string, FoodItem> = {};
            foodItems.forEach((fi) => {
                foodMap[fi.$id] = fi;
            });

            // bygg view-modell
            const mealsWithItems: Meal[] = mealRows.map((m, idx) =>
                mapToViewMeal(m, allMealItemsPerMeal[idx], foodMap)
            );

            setMeals(mealsWithItems);
        } catch (e: any) {
            setError(e?.message ?? "Failed to load meals");
            setMeals([]);
        } finally {
            setLoading(false);
        }
    }, [dateISO]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const deleteMeal = useCallback(async (mealId: string) => {
        try {
            setLoading(true);
            setError(null);

            // delete all meal_items first
            await mealItemRepo.deleteByMeal(mealId);
            // delete the meal itself
            await mealRepo.delete(mealId);

            // optimistic update in state
            setMeals((prev) => prev.filter((m) => m.id !== mealId));
        } catch (e: any) {
            setError(e?.message ?? "Failed to delete meal");
        } finally {
            setLoading(false);
        }
    }, []);

    return { meals, loading, error, refresh, deleteMeal };
}
