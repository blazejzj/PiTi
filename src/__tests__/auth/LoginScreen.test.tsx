import {
    render,
    fireEvent,
    screen,
    waitFor,
} from "@testing-library/react-native";

// mock appwrite account + helpers
jest.mock("../../services/appwrite/appwrite", () => ({
    account: {
        createEmailPasswordSession: jest.fn(),
        get: jest.fn(),
        deleteSession: jest.fn(),
    },
}));
jest.mock("../../services/appwrite/authGuard", () => ({
    ensureNoActiveSession: jest.fn(),
    getCurrentUserSafely: jest.fn(),
}));

// mock router
const mockRouter = { replace: jest.fn(), push: jest.fn(), back: jest.fn() };
jest.mock("expo-router", () => ({
    useRouter: () => mockRouter,
}));

// mock toast
jest.mock("react-native-toast-message", () => ({
    __esModule: true,
    default: { show: jest.fn() },
}));

import { account } from "../../services/appwrite/appwrite";
import {
    ensureNoActiveSession,
    getCurrentUserSafely,
} from "../../services/appwrite/authGuard";
import Toast from "react-native-toast-message";
import LoginScreen from "../../features/auth/screens/LoginScreen";

describe("LoginScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("logs in successfully and navigates to home", async () => {
        // fake happy path
        (getCurrentUserSafely as jest.Mock).mockResolvedValue(null);
        (ensureNoActiveSession as jest.Mock).mockResolvedValue(undefined);
        (account.createEmailPasswordSession as jest.Mock).mockResolvedValue({});
        (account.get as jest.Mock).mockResolvedValue({});

        render(<LoginScreen />);

        // fill in fields
        fireEvent.changeText(
            screen.getByPlaceholderText("user@PiTi.com"),
            "real@piti.no"
        );
        fireEvent.changeText(
            screen.getByPlaceholderText("*********"),
            "password"
        );

        // press the button
        fireEvent.press(screen.getByTestId("login-btn"));

        // wait for effects
        await waitFor(() => {
            expect(account.createEmailPasswordSession).toHaveBeenCalledWith({
                email: "real@piti.no",
                password: "password",
            });
            expect(mockRouter.replace).toHaveBeenCalledWith("/(home)");
            expect(Toast.show).not.toHaveBeenCalledWith(
                expect.objectContaining({ type: "error" })
            );
        });
    });

    it("shows a success toast and skips session creation when user already logged in", async () => {
        (getCurrentUserSafely as jest.Mock).mockResolvedValue({
            $id: "123",
        });

        render(<LoginScreen />);
        fireEvent.changeText(
            screen.getByPlaceholderText("user@PiTi.com"),
            "loggedin@piti.no"
        );
        fireEvent.changeText(
            screen.getByPlaceholderText("*********"),
            "password"
        );

        fireEvent.press(screen.getByTestId("login-btn"));

        await waitFor(() => {
            expect(account.createEmailPasswordSession).not.toHaveBeenCalled();
            expect(mockRouter.replace).toHaveBeenCalledWith("/(home)");
            expect(Toast.show).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "success",
                    text1: "Welcome back!",
                })
            );
        });
    });

    it("shows an error toast if login fails (network/auth error)", async () => {
        (getCurrentUserSafely as jest.Mock).mockResolvedValue(null);
        (ensureNoActiveSession as jest.Mock).mockResolvedValue(undefined);
        (account.createEmailPasswordSession as jest.Mock).mockRejectedValue(
            new Error("invalid credentials")
        );

        render(<LoginScreen />);
        fireEvent.changeText(
            screen.getByPlaceholderText("user@PiTi.com"),
            "real@piti.no"
        );
        fireEvent.changeText(
            screen.getByPlaceholderText("*********"),
            "wrongpassword"
        );

        fireEvent.press(screen.getByTestId("login-btn"));

        await waitFor(() => {
            expect(Toast.show).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "error",
                })
            );
            expect(mockRouter.replace).not.toHaveBeenCalled();
        });
    });

    it("trims email and makes it lowercase before sending", async () => {
        (getCurrentUserSafely as jest.Mock).mockResolvedValue(null);
        (ensureNoActiveSession as jest.Mock).mockResolvedValue(undefined);
        (account.createEmailPasswordSession as jest.Mock).mockResolvedValue({});
        (account.get as jest.Mock).mockResolvedValue({});

        render(<LoginScreen />);
        fireEvent.changeText(
            screen.getByPlaceholderText("user@PiTi.com"),
            "  REAL@PITI.NO  "
        );
        fireEvent.changeText(
            screen.getByPlaceholderText("*********"),
            "password"
        );

        fireEvent.press(screen.getByTestId("login-btn"));

        await waitFor(() => {
            expect(account.createEmailPasswordSession).toHaveBeenCalledWith({
                email: "real@piti.no",
                password: "password",
            });
        });
    });

    it("shows required field errors when fields are empty", async () => {
        render(<LoginScreen />);

        fireEvent.press(screen.getByTestId("login-btn"));

        expect(
            await screen.findByText("Please enter a valid e-mail address")
        ).toBeTruthy();
        expect(
            await screen.findByText("Please enter a valid password")
        ).toBeTruthy();

        expect(account.createEmailPasswordSession).not.toHaveBeenCalled();
    });

    it("pressing Go back btn calls router.back()", () => {
        render(<LoginScreen />);
        fireEvent.press(screen.getByText("← Go back"));
        expect(mockRouter.back).toHaveBeenCalledTimes(1);
    });

    it("pressing Register here! btn navigates to register", () => {
        render(<LoginScreen />);
        fireEvent.press(screen.getByText("Register here!"));
        expect(mockRouter.replace).toHaveBeenCalledWith("/(auth)/register");
    });
});
