import {
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react-native";

// mock router for nav...
const mockRouter = { replace: jest.fn(), push: jest.fn(), back: jest.fn() };
jest.mock("expo-router", () => ({
    useRouter: () => mockRouter,
}));

//mock useProfile hook..*

jest.mock("../../features/profile/hooks/useProfile", () => ({
    useProfile: jest.fn(),
}));

jest.mock("../../features/profile/api/profileRepo", () => ({
    upsertUserProfile: jest.fn(),
}));

jest.mock("react-native-toast-message", () => ({
    __esModule: true,
    default: { show: jest.fn() },
}));

import { useProfile } from "../../features/profile/hooks/useProfile";
import { upsertUserProfile } from "../../features/profile/api/profileRepo";
import Toast from "react-native-toast-message";
import CreateProfileScreen from "../../features/profile/screens/CreateProfileScreen";
import { act } from "react";

describe("CreateProfileScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useProfile as jest.Mock).mockReturnValue({
            userId: "user-666",
        });
    });

    it("saves profile successfully on valid submission and navs to profiule screen", async () => {
        (upsertUserProfile as jest.Mock).mockResolvedValue({});
        render(<CreateProfileScreen />);

        fireEvent.changeText(screen.getByPlaceholderText("Age"), "30");
        fireEvent.changeText(
            screen.getByPlaceholderText("male / female / other"),
            "male"
        );
        fireEvent.changeText(screen.getByPlaceholderText("Height (cm)"), "180");
        fireEvent.changeText(screen.getByPlaceholderText("Weight (kg)"), "75");
        // denne linja fjernes, siden vi ikke lenger har/bruker et "kcal"-input:
        // fireEvent.changeText(screen.getByPlaceholderText("kcal"), "2500");
        fireEvent.changeText(screen.getByPlaceholderText("Carbs (g)"), "300");
        fireEvent.changeText(screen.getByPlaceholderText("Fat (g)"), "70");
        fireEvent.changeText(screen.getByPlaceholderText("Protein (g)"), "150");

        fireEvent.press(screen.getByText("Save profile"));

        await waitFor(() => {
            expect(upsertUserProfile).toHaveBeenCalledWith(
                "user-666",
                expect.any(Object)
            );
            expect(Toast.show).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "success",
                })
            );
            expect(mockRouter.replace).toHaveBeenCalledWith("/(home)/profile");
        });
    });

    //No useer found test
    it("shows error toast when no userId is present", async () => {
        (useProfile as jest.Mock).mockReturnValue({
            userId: null,
        });

        render(<CreateProfileScreen />);

        fireEvent.changeText(screen.getByPlaceholderText("Age"), "30");
        fireEvent.changeText(
            screen.getByPlaceholderText("male / female / other"),
            "male"
        );
        fireEvent.changeText(screen.getByPlaceholderText("Height (cm)"), "180");
        fireEvent.changeText(screen.getByPlaceholderText("Weight (kg)"), "75");

        await act(async () => {
            fireEvent.press(screen.getByText("Save profile"));
        });

        await waitFor(() => {
            expect(Toast.show).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "error",
                    text1: "User not found",
                    text2: "Please log in again",
                })
            );
            expect(upsertUserProfile).not.toHaveBeenCalled();
        });
    });

    //upsertUserProfile fails/throws test
    it("shows error toast when upsertUserProfile fails/throws", async () => {
        (useProfile as jest.Mock).mockReturnValue({
            userId: "user-666",
        });
        (upsertUserProfile as jest.Mock).mockRejectedValue(
            new Error("Failed to s")
        );

        render(<CreateProfileScreen />);

        fireEvent.changeText(screen.getByPlaceholderText("Age"), "30");
        fireEvent.changeText(
            screen.getByPlaceholderText("male / female / other"),
            "male"
        );
        fireEvent.changeText(screen.getByPlaceholderText("Height (cm)"), "180");
        fireEvent.changeText(screen.getByPlaceholderText("Weight (kg)"), "75");

        await act(async () => {
            fireEvent.press(screen.getByText("Save profile"));
        });

        await waitFor(() => {
            expect(Toast.show).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "error",
                    text1: "Error creating profile",
                    text2: "Please try again later",
                })
            );
        });
    });

    //Back button test
    it("navigates back when back button is pressed", () => {
        render(<CreateProfileScreen />);
        fireEvent.press(screen.getByText("Back"));
        expect(mockRouter.back).toHaveBeenCalledTimes(1);
    });
});
