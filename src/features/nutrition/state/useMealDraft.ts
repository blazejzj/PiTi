import { create } from "zustand";

type DraftItem = {
    foodItemId: string;
    name: string;
    amountG: number;
    kcalPer100g: number;
    carbPer100g: number;
    fatPer100g: number;
    proteinPer100g: number;
};

type MealDraftState = {
    mealName: string;
    items: DraftItem[];
    setMealName: (name: string) => void;
    addItem: (item: DraftItem) => void;
    removeItem: (foodItemId: string) => void;
    clear: () => void;
    totals: () => {
        kcal: number;
        carb: number;
        fat: number;
        protein: number;
    };
};

export const useMealDraft = create<MealDraftState>((set, get) => ({
    mealName: "",
    items: [],

    // update meal name in draft
    setMealName: (name) => set({ mealName: name }),

    // add a new item or increaase amount if it already exists
    addItem: (item) =>
        set((state) => {
            const existing = state.items.find(
                (i) => i.foodItemId === item.foodItemId
            );

            if (existing) {
                const updated = state.items.map((i) =>
                    i.foodItemId === item.foodItemId
                        ? { ...i, amountG: i.amountG + item.amountG }
                        : i
                );
                return { items: updated };
            }

            return { items: [...state.items, item] };
        }),

    // remove one food item by its id
    removeItem: (foodItemId) =>
        set((state) => ({
            items: state.items.filter((i) => i.foodItemId !== foodItemId),
        })),

    // clear the entire draft
    clear: () => set({ mealName: "", items: [] }),

    // calculate total kcal, carbs, fat, protein for all items so we can show summary later
    totals: () => {
        const items = get().items;

        const total = items.reduce(
            (acc, it) => {
                acc.kcal += (it.kcalPer100g * it.amountG) / 100;
                acc.carb += (it.carbPer100g * it.amountG) / 100;
                acc.fat += (it.fatPer100g * it.amountG) / 100;
                acc.protein += (it.proteinPer100g * it.amountG) / 100;
                return acc;
            },
            { kcal: 0, carb: 0, fat: 0, protein: 0 }
        );

        return {
            kcal: Math.round(total.kcal),
            carb: Math.round(total.carb),
            fat: Math.round(total.fat),
            protein: Math.round(total.protein),
        };
    },
}));
