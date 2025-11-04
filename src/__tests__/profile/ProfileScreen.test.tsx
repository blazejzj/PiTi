import { render, screen, fireEvent } from "@testing-library/react-native";

// mock router for nav...
const mockRouter = { replace: jest.fn(), push: jest.fn(), back: jest.fn() };
jest.mock("expo-router", () => ({
    useRouter: () => mockRouter,
}));

//mock useProfile hook..*

jest.mock("../../features/profile/hooks/useProfile", () => ({
    useProfile: jest.fn(),
}));

import { useProfile } from "../../features/profile/hooks/useProfile";
import ProfileScreen from "../../features/profile/screens/ProfileScreen";

describe("ProfileScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // default mock return value for useProfile - prevents crachses and errors in tetsts bc of missing mock.?. Can be overridden in individual tests. hm, fixed with async, returns promise instead. Redundant now?
        (useProfile as jest.Mock).mockReturnValue({
            loading: false,
            error: null,
            profile: null,
        });
    });

    //Test one
    it("renders profile information correctly when profile is not nulll..", async () =>
        //mock data returned from hookyhook.
        {
            (useProfile as jest.Mock).mockReturnValue({
                loading: false,
                profile: {
                    age: 30,
                    sex: "male",
                    height_cm: 180,
                    weight_kg: 75,
                    daily_kcal_target: 2500,
                    carb_target_g: 300,
                    fat_target_g: 70,
                    protein_target_g: 150,
                },
                error: null,
            });

            render(<ProfileScreen />);

            // Assertting:  that profile information is displayed
            expect(screen.getByText("Ola Nordmann")).toBeTruthy();
            expect(screen.getAllByText("Vekt").length).toBeGreaterThan(0);
            expect(screen.getAllByText("75 kg").length).toBeGreaterThan(0);
            expect(screen.getByText("Kalorimål")).toBeTruthy();
            expect(screen.getByText("2500")).toBeTruthy();
            expect(screen.getByText("Økter")).toBeTruthy();
            expect(screen.getByText("Personlige mål")).toBeTruthy();
            expect(screen.getByText("Vektmål")).toBeTruthy();
            expect(screen.getByText("Kroppsinfo")).toBeTruthy();
            expect(screen.getByText("Alder")).toBeTruthy();
            expect(screen.getByText("30 år")).toBeTruthy();
            expect(screen.getByText("BMI")).toBeTruthy();
            expect(screen.getByText("23.1")).toBeTruthy();
            expect(screen.getByText("Innstillinger")).toBeTruthy();
            expect(screen.getByText("Rediger profil")).toBeTruthy();
        });
});

//Test two
it("renders notjhing when profile is null", async () => {
    //mock data returned from hook again.
    (useProfile as jest.Mock).mockReturnValue({
        loading: false,
        profile: null,
        error: null,
    });

    const { toJSON } = render(<ProfileScreen />);
    expect(toJSON()).toBeNull();
});

//Test three..
it("navigates to CreateProfileScreen when edit button is pressed", async () => {
    (useProfile as jest.Mock).mockReturnValue({
        loading: false,
        error: null,
        profile: {
            age: 25,
            sex: "male",
            height_cm: 180,
            weight_kg: 75,
            daily_kcal_target: 2500,
            carb_target_g: 300,
            fat_target_g: 70,
            protein_target_g: 150,
        },
    });

    render(<ProfileScreen />);

    const button = screen.getByText("Rediger profil");
    fireEvent.press(button);

    expect(mockRouter.push).toHaveBeenCalledWith("/(home)/profile/setup");
});
