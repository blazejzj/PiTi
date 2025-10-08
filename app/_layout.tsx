import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <View style={{ flex: 1 }}>
                <Slot />
            </View>
        </SafeAreaProvider>
    );
}
