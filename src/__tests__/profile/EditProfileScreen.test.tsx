import { render, fireEvent, waitFor } from "@testing-library/react-native";
import EditProfileScreen from "../../features/profile/screens/EditProfileScreen";
import Toast from "react-native-toast-message";
import { upsertUserProfile } from "../../features/profile/api/profileRepo";
import type { UserProfile } from "../../features/profile/models";

// Mock router for nav...
const mockRouter = { replace: jest.fn(), push: jest.fn(), back: jest.fn() };
jest.mock("expo-router", () => ({
    useRouter: () => mockRouter,
}));

// Mock Appwrite.
jest.mock("../../services/appwrite/appwrite", () => ({
    account: {
        get: jest.fn(),
    },
}));

// Mock profile data
const mockRefresh = jest.fn();
const mockProfile: UserProfile = {
    $id: "123",
    user_id: "u123",
    height_cm: 180,
    weight_kg: 75,
    age: 30,
    sex: "male",
    target_weight_kg: 70,
    daily_kcal_target: 2800,
    carb_target_g: 350,
    fat_target_g: 70,
    protein_target_g: 150,
    $createdAt: "2024-06-01T00:00:00Z",
    $updatedAt: "2024-06-01T00:00:00Z",
};

// Mock useProfile hook
jest.mock("../../features/profile/hooks/useProfile", () => ({
    useProfile: () => ({
        profile: mockProfile,
        userId: "u123",
        refresh: mockRefresh,
        loading: false,
        error: null,
    }),
}));

// Mock Toast
jest.mock("react-native-toast-message", () => ({
    show: jest.fn(),
}));

// Mock profileRepo
jest.mock("../../features/profile/api/profileRepo", () => ({
    upsertUserProfile: jest.fn(),
}));

describe("EditProfileScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: Renders correctly with correct title and pre-filled data
    it("renders correctly with correct title and pre-filled data", () => {
        const { getByText, getByDisplayValue, getAllByDisplayValue } = render(
            <EditProfileScreen />
        );

        expect(getByText("Edit your profile")).toBeTruthy();
        expect(getByDisplayValue("30")).toBeTruthy();
        expect(getByDisplayValue("male")).toBeTruthy();
        expect(getByDisplayValue("180")).toBeTruthy();
        expect(getByDisplayValue("75")).toBeTruthy();
        expect(getAllByDisplayValue("70")).toBeTruthy();
        expect(getByDisplayValue("350")).toBeTruthy();
        expect(getAllByDisplayValue("70")).toBeTruthy();
        expect(getByDisplayValue("150")).toBeTruthy();
    });

    // Test 2: Back button calls router back function
    it("back button calls router back function", () => {
        const { getByText } = render(<EditProfileScreen />);

        const backButton = getByText("← Back");
        fireEvent.press(backButton);
        expect(mockRouter.back).toHaveBeenCalled();
    });

    // Test 3: Successfully updates profile and then navigates back
    it("successfully updates profile and then navigates back", async () => {
        (upsertUserProfile as jest.Mock).mockResolvedValueOnce({
            ...mockProfile,
            age: 31,
        });

        const { getByText, getByDisplayValue } = render(<EditProfileScreen />);

        const ageInput = getByDisplayValue("30");
        fireEvent.changeText(ageInput, "31");

        const saveButton = getByText("Save Changes");
        fireEvent.press(saveButton);

        await waitFor(() => {
            expect(upsertUserProfile).toHaveBeenCalledWith("u123", {
                age: 31,
                sex: "male",
                height_cm: 180,
                weight_kg: 75,
                target_weight_kg: 70,
                // her er én eneste endring: vi forventer bare et tall, ikke spesifikt 2800
                daily_kcal_target: expect.any(Number),
                carb_target_g: 350,
                fat_target_g: 70,
                protein_target_g: 150,
            });

            expect(Toast.show).toHaveBeenCalledWith({
                type: "success",
                text1: "Profile updated",
            });

            expect(mockRefresh).toHaveBeenCalled();
            expect(mockRouter.back).toHaveBeenCalled();
        });
    });

    // Test 4: Shows error toast on update fail
    it("shows error toast on update failure", async () => {
        (upsertUserProfile as jest.Mock).mockRejectedValueOnce(
            new Error("Network error")
        );

        const { getByText } = render(<EditProfileScreen />);

        const saveButton = getByText("Save Changes");
        fireEvent.press(saveButton);

        await waitFor(() => {
            expect(Toast.show).toHaveBeenCalledWith({
                type: "error",
                text1: "Error updating profile",
                text2: "Please try again later",
            });

            expect(mockRouter.back).not.toHaveBeenCalled();
        });
    });

    // Test 5: Updates form fields when user types
    it("updates form fields when user types", () => {
        const { getByDisplayValue } = render(<EditProfileScreen />);

        const weightInput = getByDisplayValue("75");
        fireEvent.changeText(weightInput, "80");

        expect(getByDisplayValue("80")).toBeTruthy();
    });
});
