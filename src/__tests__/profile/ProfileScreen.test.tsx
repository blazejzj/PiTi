import {
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react-native";

// Mock Appwrite
jest.mock("../../services/appwrite/appwrite", () => ({
    account: {
        get: jest.fn().mockResolvedValue({ email: "testuser@example.com" }),
    },
}));

// Mock router
const mockRouter = { replace: jest.fn(), push: jest.fn(), back: jest.fn() };
jest.mock("expo-router", () => ({
    useRouter: () => mockRouter,
}));

// Mock useProfile
jest.mock("../../features/profile/hooks/useProfile", () => ({
    useProfile: jest.fn(),
}));

import { useProfile } from "../../features/profile/hooks/useProfile";
import ProfileScreen from "../../features/profile/screens/ProfileScreen";

describe("ProfileScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test one:
    it("renders profile information correctly when profile is not null", async () => {
        (useProfile as jest.Mock).mockReturnValue({
            loading: false,
            error: null,
            profile: {
                weight_kg: 75,
                height_cm: 180,
                age: 30,
                target_weight_kg: 70,
                daily_kcal_target: 2000,
                protein_target_g: 150,
                fat_target_g: 70,
                carb_target_g: 250,
            },
        });

        render(<ProfileScreen />);

        await waitFor(
            () => {
                expect(screen.getByText("testuser")).toBeTruthy();
            },
            { timeout: 500 }
        );

        expect(screen.getAllByText("Weight").length).toBeGreaterThan(0);
        expect(screen.getAllByText("75 kg").length).toBeGreaterThan(0);
        expect(screen.getByText("Calorie Goal")).toBeTruthy();
        expect(screen.getByText(/2000/)).toBeTruthy();
    });

    // test two:
    it("navigates to EditProfileScreen when edit Profile button is pressed", async () => {
        (useProfile as jest.Mock).mockReturnValue({
            loading: false,
            error: null,
            profile: {
                weight_kg: 70,
                height_cm: 180,
                age: 28,
                target_weight_kg: 65,
                daily_kcal_target: 1800,
                protein_target_g: 120,
                fat_target_g: 60,
                carb_target_g: 220,
            },
        });

        render(<ProfileScreen />);

        await waitFor(() => {
            expect(screen.getByText("testuser")).toBeTruthy();
        });

        const button = screen.getByText("Edit Profile");
        fireEvent.press(button);

        expect(mockRouter.push).toHaveBeenCalledWith("/(home)/profile/edit");
    });

    // test three:
    it("returns null when profile is not available/null.. ", () => {
        (useProfile as jest.Mock).mockReturnValue({
            loading: false,
            error: null,
            profile: null,
        });

        const { toJSON } = render(<ProfileScreen />);
        expect(toJSON()).toBeNull();
    });
});
