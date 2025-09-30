import { Pressable, PressableProps, Text, View } from "react-native";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = Omit<PressableProps, "style" | "children"> & {
    /* Text inside the button */
    title: string;
    /* Which “flavor” of button, this changes colors and is optional */
    variant?: ButtonVariant;
    /* How much the button will shrinks when pressed 0.98 = 98% in size */
    pressScale?: number;
    /* if true, button is not clickable and looks faded, also optional */
    disabled?: boolean;
    /* override label for screen readers otherwise the title is what fallback is */
    accessibilityLabel?: string;
    /* Nativewind (tailwidn) classes if you wanna style it more */
    className?: string;
};

export default function Button({
    title,
    variant = "primary",
    className = "",
    pressScale = 0.98,
    accessibilityLabel,
    disabled = false,
    onPress,
    ...rest // <-- all the other normal Pressable props for example onLongPress
}: ButtonProps) {
    // base look for all buttons
    const baseStyling =
        "p-5 items-center rounded-3xl overflow-hidden w-sm self-center";

    // choose bg color depending on variant
    const variantClass =
        variant === "primary" ? "theme-bg-color" : "bg-gray-200";

    // how dark the overlay tint is when pressed
    const pressedOverlay = variant === "primary" ? 0.08 : 0.06;

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            android_ripple={{
                // ripple color is a bit stronger on primary
                color:
                    variant === "primary"
                        ? "rgba(0,0,0,0.12)"
                        : "rgba(0,0,0,0.08)",
                foreground: true,
            }}
            className={`${baseStyling} ${variantClass} ${
                disabled ? "opacity-60" : ""
            } ${className}`}
            // tell screen readers "hey this is a button"
            accessibilityRole="button"
            // communicates state (disabled for example) to assistive things (readers)
            accessibilityState={{ disabled }}
            // What screen readers actually read out loud. Title is fallback.
            // Example: title="ok", accessibiliyLabel="Confirm registration (which is much better, duh"
            accessibilityLabel={accessibilityLabel ?? title}
            style={({ pressed }) => ({
                transform: [{ scale: pressed ? pressScale : 1 }],
                opacity: pressed ? 0.98 : 1,
            })}
            {...rest}
        >
            {({ pressed }) => (
                <>
                    <Text className="font-bold">{title}</Text>
                    <View
                        pointerEvents="none"
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "black",
                            opacity: pressed ? pressedOverlay : 0,
                        }}
                    />
                </>
            )}
        </Pressable>
    );
}
