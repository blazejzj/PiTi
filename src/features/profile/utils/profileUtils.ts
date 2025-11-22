import type { UserProfile } from "../models";

export type ProfileFormValues = {
    age: string;
    sex: string;
    height_cm: string;
    weight_kg: string;
    target_weight_kg: string;
    carb_target_g: string;
    fat_target_g: string;
    protein_target_g: string;
};

export const emptyProfileFormValues: ProfileFormValues = {
    age: "",
    sex: "",
    height_cm: "",
    weight_kg: "",
    target_weight_kg: "",
    carb_target_g: "",
    fat_target_g: "",
    protein_target_g: "",
};

export const calculateMacroCalories = (
    protein: string,
    carbs: string,
    fat: string
): number => {
    const p = Number(protein) || 0;
    const c = Number(carbs) || 0;
    const f = Number(fat) || 0;
    return p * 4 + c * 4 + f * 9;
};

export const profileToFormValues = (
    profile: UserProfile | null | undefined
): ProfileFormValues => {
    if (!profile) return emptyProfileFormValues;

    return {
        age: profile.age?.toString() ?? "",
        sex: profile.sex ?? "",
        height_cm: profile.height_cm?.toString() ?? "",
        weight_kg: profile.weight_kg?.toString() ?? "",
        target_weight_kg: profile.target_weight_kg?.toString() ?? "",
        carb_target_g: profile.carb_target_g?.toString() ?? "",
        fat_target_g: profile.fat_target_g?.toString() ?? "",
        protein_target_g: profile.protein_target_g?.toString() ?? "",
    };
};

export type UpsertUserProfilePayload = {
    age: number;
    sex: "male" | "female" | "other";
    height_cm: number;
    weight_kg: number;
    target_weight_kg: number;
    daily_kcal_target: number;
    carb_target_g: number;
    fat_target_g: number;
    protein_target_g: number;
};

export const formValuesToPayload = (
    data: ProfileFormValues
): UpsertUserProfilePayload => {
    const rawSex = data.sex.trim().toLowerCase();
    const sex: "male" | "female" | "other" =
        rawSex === "male" || rawSex === "female" || rawSex === "other"
            ? rawSex
            : "other";

    return {
        age: Number(data.age),
        sex,
        height_cm: Number(data.height_cm),
        weight_kg: Number(data.weight_kg),
        target_weight_kg: Number(data.target_weight_kg),
        daily_kcal_target: calculateMacroCalories(
            data.protein_target_g,
            data.carb_target_g,
            data.fat_target_g
        ),
        carb_target_g: Number(data.carb_target_g),
        fat_target_g: Number(data.fat_target_g),
        protein_target_g: Number(data.protein_target_g),
    };
};
