export type HumanError = { title: string; message: string };

// This is probably something that shoudl be redone at some point
// unsure if writing out stuff like this (hardcoding) is a good idea
// a different solution is probably recommended
export function toHumanError(err: unknown): HumanError {
    // defining a fallback just incase we've missed something
    const fallback: HumanError = {
        title: "Something went wrong",
        message: "Please try again, or check your internet connection.",
    };

    if (!err || typeof err !== "object") return fallback;

    const anyErr = err as any;
    const msg: string = String(anyErr?.message || anyErr);

    if (msg.includes("Creation of a session is prohibited")) {
        return {
            title: "You're already logged in",
            message: "Logging you in again... Please stand by",
        };
    }
    if (
        msg.includes("A user with the same id, email, or phone already exists")
    ) {
        return {
            title: "E-mail adress already in use",
            message: "Please try logging in or resetting your password",
        };
    }
    if (msg.includes("Invalid credentials")) {
        return {
            title: "Wrong e-mail or password",
            message: "Check your credentials and try again",
        };
    }

    return { ...fallback, message: msg.length > 160 ? fallback.message : msg };
}
