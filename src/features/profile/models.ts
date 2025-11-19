export type UserProfile = {
    $id: string;
    user_id: string;
    height_cm?: number | null;
    weight_kg?: number | null;
    age?: number | null;
    sex?: "male" | "female" | "other" | null;
    target_weight_kg?: number | null;
    daily_kcal_target?: number | null;
    carb_target_g?: number | null;
    fat_target_g?: number | null;
    protein_target_g?: number | null;
    $createdAt: string;
    $updatedAt: string;
};
