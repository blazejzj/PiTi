import { useState, useEffect, useMemo } from "react";
import { mealRepo } from "../repository/mealRepo";
import { mealItemRepo } from "../repository/mealItemRepo";
// import { DummyMeals } from "../../../lib/dummyDataMeal";
import { useDailyMeals } from "./useDailyMeals";

type DailyTotals = {
    kcal: number;
    carbG: number;
    fatG: number;
    proteinG: number;
};

//refactored to use the new useDailyMeals hook, which already fetches meals for today. Minimal working changes.
// app runs fine and calculates totals based on real data now. Tested as we speak.

export function useDailyNutrition(userId: string | null, reloadKey?: number) {
    const todayISO = useMemo(() => new Date().toISOString(), []);

    const { meals, loading, error } = useDailyMeals(todayISO, reloadKey);

    const totals: DailyTotals = useMemo(() => {
        return meals.reduce(
            (acc, meal) => ({
                kcal: acc.kcal + meal.totalKcal,
                carbG: acc.carbG + meal.carbs,
                fatG: acc.fatG + meal.fat,
                proteinG: acc.proteinG + meal.protein,
            }),
            { kcal: 0, carbG: 0, fatG: 0, proteinG: 0 }
        );
    }, [meals]);

    return { loading, totals, error };

    /*   const [loading, setLoading] = useState(true);

    const [totals, setTotals] = useState<DailyTotals>({
        kcal: 0,
        carbG: 0,
        fatG: 0,
        proteinG: 0,
    });
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        } */

    // Since nutrition is using Dummydata - hook is not "working" yet, so temp change to use dummy data to check if totals display works

    /* const fetchTotals = async () => {
            setLoading(true);
            setError(null);
            try {
                const today = new Date().toISOString().split("T")[0];
                console.log("Fethcing meals for date", today);
                const meals = await mealRepo.listByDate(userId, today);
                console.log("Found meals:", meals.length);

                let totalKcal = 0;
                let totalCarbG = 0;
                let totalFatG = 0;
                let totalProteinG = 0;

                for (const meal of meals) {
                    const items = await mealItemRepo.listByMeal(meal.$id);
                    for (const item of items) {
                        totalKcal += item.kcal || 0;
                        totalCarbG += item.carbG || 0;
                        totalFatG += item.fatG || 0;
                        totalProteinG += item.proteinG || 0;
                    }
                }

                setTotals({
                    kcal: totalKcal,
                    carbG: totalCarbG,
                    fatG: totalFatG,
                    proteinG: totalProteinG,
                });
            } catch (err) {
                console.error("Failed to fetch daily nutrition:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTotals();
    }, [userId]); */

    /*    const calculateDummyTotals = () => {
            setLoading(true);
            const calculated = DummyMeals.reduce(
                (acc, meal) => ({
                    kcal: acc.kcal + meal.totalKcal,
                    carbG: acc.carbG + meal.carbs,
                    fatG: acc.fatG + meal.fat,
                    proteinG: acc.proteinG + meal.protein,
                }),
                { kcal: 0, carbG: 0, fatG: 0, proteinG: 0 }
            );
            setTotals(calculated);
            setLoading(false);
        };

        calculateDummyTotals();
    }, [userId]);

    return { loading, totals, error }; */
}
