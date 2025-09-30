import { Pressable, Text, View } from "react-native";
import Logo from "../../../components/Logo";

/*
TODO:

- Split components slightly, maybe a custom button component?
- Get the buttons working for those 2 specific pages (register and login)

*/
export default function WelcomeScreen() {
    return (
        <View className="flex-1 p-10 justify-center gap-5">
            <View className="items-center gap-5">
                <Logo />
                <View className="items-center gap-5">
                    <Text className="font-bold text-5xl text-center">
                        Welcome to PiTi
                    </Text>
                    <Text className="text-lg text-center">
                        Your personal training and nutrition assistant. Track
                        progress, reach goals, become
                        <Text className="font-bold"> stronger</Text>.
                    </Text>
                </View>
            </View>

            <View className="mt-16 gap-6">
                <Pressable
                    onPress={() => console.log("take me to register page yes")}
                    android_ripple={{
                        color: "rgba(0,0,0,0.12)",
                        foreground: true,
                    }}
                    className="theme-bg-color p-5 items-center rounded-3xl overflow-hidden w-sm self-center"
                    style={({ pressed }) => ({
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                        opacity: pressed ? 0.98 : 1,
                    })}
                >
                    {({ pressed }) => (
                        <>
                            <Text className="font-bold">Get started!</Text>
                            <View
                                pointerEvents="none"
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundColor: "black",
                                    opacity: pressed ? 0.08 : 0,
                                }}
                            />
                        </>
                    )}
                </Pressable>

                <Pressable
                    onPress={() => console.log("take me to login page yooo")}
                    android_ripple={{
                        color: "rgba(0,0,0,0.08)",
                        foreground: true,
                    }}
                    className="bg-gray-200 p-5 items-center rounded-3xl overflow-hidden w-sm self-center"
                    style={({ pressed }) => ({
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                        opacity: pressed ? 0.98 : 1,
                    })}
                >
                    {({ pressed }) => (
                        <>
                            <Text className="font-bold">
                                Already have an account?
                            </Text>
                            <View
                                pointerEvents="none"
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundColor: "black",
                                    opacity: pressed ? 0.06 : 0,
                                }}
                            />
                        </>
                    )}
                </Pressable>
            </View>
        </View>
    );
}
