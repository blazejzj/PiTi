import { useEffect, useState } from "react";
import { account } from "../../../services/appwrite/appwrite";
import { mealRepo } from "../repository/mealRepo";
import { mealItemRepo } from "../repository/mealItemRepo";
import type { Meal, MealRow, MealItem } from "../models";

type DailyMealsState = {
    meals: Meal[];
    loading: boolean;
    error: string | null;
};

const mapToViewMeal = (mealRow: MealRow, mealItems: MealItem[]): Meal => {
    const totals = mealItems.reduce(
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
        foodItems: [],
    };
};

export function useDailyMeals(dateISO: string): DailyMealsState {
    const [state, setState] = useState<DailyMealsState>({
        meals: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                setState((s) => ({ ...s, loading: true, error: null }));

                const user = await account.get();

                const mealRows: MealRow[] = await mealRepo.listByDate(
                    user.$id,
                    dateISO
                );

                const mealsWithItems = await Promise.all(
                    mealRows.map(async (m) => {
                        const items = (await mealItemRepo.listByMeal(
                            m.$id
                        )) as MealItem[];
                        return mapToViewMeal(m, items);
                    })
                );

                if (!cancelled) {
                    setState({
                        meals: mealsWithItems,
                        loading: false,
                        error: null,
                    });
                }
            } catch (e: any) {
                if (!cancelled) {
                    setState({
                        meals: [],
                        loading: false,
                        error: e?.message ?? "Failed to load meals",
                    });
                }
            }
        };

        run();

        return () => {
            cancelled = true;
        };
    }, [dateISO]);

    return state;
}
