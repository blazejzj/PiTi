import { render, screen, fireEvent } from "@testing-library/react-native";
import DashboardScreen from "../../features/dashboard/screens/DashboardScreen";
import type { UserProfile } from "../../features/profile/models";
import { useDailyNutrition } from "../../features/nutrition/hooks/useDailyNutrition";

// Mocking useDailyNutrition hook
jest.mock("../../features/nutrition/hooks/useDailyNutrition", () => ({
    useDailyNutrition: jest.fn(),
}));

jest.mock("expo-router", () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    }),
    useFocusEffect: jest.fn(),
}));

describe("DashboardScreen", () => {
    const mockProfile: UserProfile = {
        $id: "profile-123",
        user_id: "user-123",
        daily_kcal_target: 2500,
        protein_target_g: 150,
        fat_target_g: 70,
        carb_target_g: 300,
        target_weight_kg: 70,
        age: 30,
        sex: "male",
        height_cm: 180,
        weight_kg: 75,
        $createdAt: "2024-01-01T00:00:00Z",
        $updatedAt: "2024-01-01T00:00:00Z",
    };

    const mockOnLogout = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test one: dashboard renders correctly with totals.
    it("renders dashboard with profile data and nutrition totals", () => {
        (useDailyNutrition as jest.Mock).mockReturnValue({
            totals: { kcal: 1800, proteinG: 120, fatG: 60, carbG: 200 },
            loading: false,
            error: null,
        });

        render(<DashboardScreen profile={mockProfile} userId="user-123" />);

        // Overskriften for dagens kort
        expect(screen.getByText("Today's overview")).toBeTruthy();

        // Makro-kortene viser riktige verdier
        expect(screen.getByText("Protein")).toBeTruthy();
        expect(screen.getByText("Carbs")).toBeTruthy();
        expect(screen.getByText("Fat")).toBeTruthy();

        expect(screen.getByText("120.0g")).toBeTruthy();
        expect(screen.getByText("200.0g")).toBeTruthy();
        expect(screen.getByText("60.0g")).toBeTruthy();

        // Targets fra profile vises i kortene
        expect(screen.getByText("Target: 150g")).toBeTruthy();
        expect(screen.getByText("Target: 300g")).toBeTruthy();
        expect(screen.getByText("Target: 70g")).toBeTruthy();
    });

    //test two: check if remaining calories are calculated correctly:
    it("calculates remaining calories correctly", () => {
        (useDailyNutrition as jest.Mock).mockReturnValue({
            totals: { kcal: 1200, proteinG: 80, fatG: 40, carbG: 150 },
            loading: false,
            error: null,
        });

        render(<DashboardScreen profile={mockProfile} userId="user-123" />);

        // CalorieRing viser "Remaining 1300 kcal" i midten
        expect(screen.getByText("Remaining 1300 kcal")).toBeTruthy();
    });

    // test 3: ensure remaining cals never go negative.
    it("ensures remaining calories never go negative", () => {
        (useDailyNutrition as jest.Mock).mockReturnValue({
            totals: { kcal: 3000, proteinG: 180, fatG: 90, carbG: 350 },
            loading: false,
            error: null,
        });

        render(<DashboardScreen profile={mockProfile} userId="user-123" />);

        // Over målet skal vi se "Over by 500 kcal" i stedet for negativ remaining
        expect(screen.getByText("Over by 500 kcal")).toBeTruthy();
    });

    // test 4: Edge case - null targets in profile?
    it("handles missing/null profile gracefully", () => {
        const emptyProfile: UserProfile = {
            ...mockProfile,
            daily_kcal_target: null,
            protein_target_g: null,
            fat_target_g: null,
            carb_target_g: null,
        };

        (useDailyNutrition as jest.Mock).mockReturnValue({
            totals: { kcal: 1500, proteinG: 100, fatG: 50, carbG: 180 },
            loading: false,
            error: null,
        });

        render(<DashboardScreen profile={emptyProfile} userId="user-123" />);

        expect(screen.getByText("No calorie target set")).toBeTruthy();

        expect(screen.getByText("100.0g")).toBeTruthy();
        expect(screen.getByText("50.0g")).toBeTruthy();
        expect(screen.getByText("180.0g")).toBeTruthy();

        const placeholderTargets = screen.getAllByText("Target: —g");
        expect(placeholderTargets.length).toBe(3);
    });
});
