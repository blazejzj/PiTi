import {
    render,
    fireEvent,
    screen,
    waitFor,
} from "@testing-library/react-native";

// mock the whole appwrite oaccount object, so we dont have to think about
// the logic within
jest.mock("../../services/appwrite/appwrite", () => ({
    account: {
        create: jest.fn(),
        createEmailPasswordSession: jest.fn(),
    },
}));

// mock the router
const mockRouter = { replace: jest.fn(), push: jest.fn(), back: jest.fn() };
jest.mock("expo-router", () => ({
    useRouter: () => mockRouter,
}));

import { account } from "../../services/appwrite/appwrite";
import RegisterScreen from "../../features/auth/screens/RegisterScreen";

describe("RegisterScreen", () => {
    beforeEach(() => {
        // reset all mocks after before each test
        jest.clearAllMocks();
    });

    it("The happy-path & navigation", async () => {
        // Arrange
        render(<RegisterScreen />);
        const nameField = screen.getByPlaceholderText("Hugh Jass");
        const emailField = screen.getByPlaceholderText("user@PiTi.com");
        const [passwordField, confirmField] =
            screen.getAllByPlaceholderText("********");
        const registerBtn = screen.getByTestId("register-btn");

        // Act
        fireEvent.changeText(nameField, "Real Name");
        fireEvent.changeText(emailField, "real@piti.no");
        fireEvent.changeText(passwordField, "password");
        fireEvent.changeText(confirmField, "password");

        // press register btn
        fireEvent.press(registerBtn);

        // Assert
        await waitFor(() => {
            expect(account.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: "real@piti.no",
                    name: "Real Name",
                    password: "password",
                    userId: expect.any(String),
                })
            );
            expect(account.createEmailPasswordSession).toHaveBeenCalledTimes(1);
            expect(mockRouter.replace).toHaveBeenCalled();
        });
    });

    it("Account created, but network/auth error from appwrite occurs", async () => {
        // Arrange
        // mock and reject
        (account.create as jest.Mock).mockResolvedValue({});
        (account.createEmailPasswordSession as jest.Mock).mockRejectedValue(
            new Error("session failed or network error occured")
        );

        render(<RegisterScreen />);
        const nameField = screen.getByPlaceholderText("Hugh Jass");
        const emailField = screen.getByPlaceholderText("user@PiTi.com");
        const [passwordField, confirmField] =
            screen.getAllByPlaceholderText("********");
        const registerBtn = screen.getByTestId("register-btn");

        // Act
        fireEvent.changeText(nameField, "Real Name");
        fireEvent.changeText(emailField, "real@piti.no");
        fireEvent.changeText(passwordField, "password");
        fireEvent.changeText(confirmField, "password");

        // press register btn
        fireEvent.press(registerBtn);

        // Assert
        await waitFor(() => {
            expect(account.create).toHaveBeenCalledTimes(1);
            expect(account.createEmailPasswordSession).toHaveBeenCalledTimes(1);
            expect(mockRouter.replace).not.toHaveBeenCalled();
        });
    });

    it("passes exact email/password to session and navigates when success", async () => {
        // Arrange && Act
        (account.create as jest.Mock).mockResolvedValue({});
        (account.createEmailPasswordSession as jest.Mock).mockResolvedValue({});

        render(<RegisterScreen />);
        fireEvent.changeText(
            screen.getByPlaceholderText("Hugh Jass"),
            "Real Name"
        );
        fireEvent.changeText(
            screen.getByPlaceholderText("user@PiTi.com"),
            "real@piti.no"
        );
        const [passwordField, confirmField] =
            screen.getAllByPlaceholderText("********");
        fireEvent.changeText(passwordField, "password");
        fireEvent.changeText(confirmField, "password");

        fireEvent.press(screen.getByTestId("register-btn"));

        // Assert
        await waitFor(() => {
            expect(account.createEmailPasswordSession).toHaveBeenCalledWith({
                email: "real@piti.no",
                password: "password",
            });
            expect(mockRouter.replace).toHaveBeenCalledWith("/(home)");
        });
    });

    it("when account.create fails, does not start session or navigate", async () => {
        // Arrange && Act
        (account.create as jest.Mock).mockRejectedValue(
            new Error("already exists")
        );

        render(<RegisterScreen />);
        fireEvent.changeText(
            screen.getByPlaceholderText("Hugh Jass"),
            "Real Name"
        );
        fireEvent.changeText(
            screen.getByPlaceholderText("user@PiTi.com"),
            "real@piti.no"
        );
        const [passwordField, confirmField] =
            screen.getAllByPlaceholderText("********");
        fireEvent.changeText(passwordField, "password");
        fireEvent.changeText(confirmField, "password");

        fireEvent.press(screen.getByTestId("register-btn"));

        // Assert
        await waitFor(() => {
            expect(account.create).toHaveBeenCalledTimes(1);
            expect(account.createEmailPasswordSession).not.toHaveBeenCalled();
            expect(mockRouter.replace).not.toHaveBeenCalled();
        });
    });

    it("trims leading/trailing spaces from name and email before submit", async () => {
        // Arrange && Act
        (account.create as jest.Mock).mockResolvedValue({});
        (account.createEmailPasswordSession as jest.Mock).mockResolvedValue({});

        render(<RegisterScreen />);
        fireEvent.changeText(
            screen.getByPlaceholderText("Hugh Jass"),
            "  Real Name  "
        );
        fireEvent.changeText(
            screen.getByPlaceholderText("user@PiTi.com"),
            "  real@piti.no  "
        );
        const [passwordField, confirmField] =
            screen.getAllByPlaceholderText("********");
        fireEvent.changeText(passwordField, "password");
        fireEvent.changeText(confirmField, "password");

        fireEvent.press(screen.getByTestId("register-btn"));

        // Assert
        await waitFor(() => {
            expect(account.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "Real Name",
                    email: "real@piti.no",
                })
            );
        });
    });

    it("shows an error message when passwords do not match", async () => {
        // Arrange && Act
        render(<RegisterScreen />);

        fireEvent.changeText(
            screen.getByPlaceholderText("Hugh Jass"),
            "Real Name"
        );
        fireEvent.changeText(
            screen.getByPlaceholderText("user@PiTi.com"),
            "real@piti.no"
        );
        const [passwordField, confirmField] =
            screen.getAllByPlaceholderText("********");
        fireEvent.changeText(passwordField, "password");
        fireEvent.changeText(confirmField, "drowssap");
        fireEvent.press(screen.getByTestId("register-btn"));

        // Assert
        expect(await screen.findByText("Passwords must match")).toBeTruthy();
        expect(account.create).not.toHaveBeenCalled();
    });

    it("shows email error and does not call our backend when email contains spaces", async () => {
        // Arrange && Act

        render(<RegisterScreen />);
        fireEvent.changeText(
            screen.getByPlaceholderText("Hugh Jass"),
            "Real Name"
        );
        fireEvent.changeText(
            screen.getByPlaceholderText("user@PiTi.com"),
            "real @piti.no"
        );
        const [passwordField, confirmField] =
            screen.getAllByPlaceholderText("********");
        fireEvent.changeText(passwordField, "password");
        fireEvent.changeText(confirmField, "password");
        fireEvent.press(screen.getByTestId("register-btn"));

        // Assert
        expect(await screen.findByText("Enter a valid email")).toBeTruthy();
        expect(account.create).not.toHaveBeenCalled();
        expect(account.createEmailPasswordSession).not.toHaveBeenCalled();
    });

    it("pressing Go back b calls router.back()", () => {
        // Arrange
        render(<RegisterScreen />);
        // Act
        fireEvent.press(screen.getByText("← Go back"));
        // Assert
        expect(mockRouter.back).toHaveBeenCalledTimes(1);
    });

    it("pressing Log in btn navigates to login and does not call backend", () => {
        // Arrange
        render(<RegisterScreen />);

        // Act
        fireEvent.press(screen.getByText("Log in here!"));

        // Assert
        expect(mockRouter.replace).toHaveBeenCalledWith("/(auth)/login");
        expect(account.create).not.toHaveBeenCalled();
        expect(account.createEmailPasswordSession).not.toHaveBeenCalled();
    });

    it("shows required field errors and does not call backend on empty submit (no fields are filed)", async () => {
        // Arrange
        render(<RegisterScreen />);

        // Act
        fireEvent.press(screen.getByTestId("register-btn"));

        // Assert
        expect(await screen.findByText("Please enter your name")).toBeTruthy();
        expect(
            await screen.findByText("Please enter a valid e-mail address")
        ).toBeTruthy();
        expect(
            await screen.findByText("Please enter a valid password")
        ).toBeTruthy();
        expect(
            await screen.findByText("Please confirm your password")
        ).toBeTruthy();

        expect(account.create).not.toHaveBeenCalled();
        expect(account.createEmailPasswordSession).not.toHaveBeenCalled();
    });
});
