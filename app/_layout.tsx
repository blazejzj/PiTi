import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { View } from "react-native";
import Toast from "react-native-toast-message";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <View style={{ flex: 1 }}>
                <Slot />
                <Toast position="bottom" />
            </View>
        </SafeAreaProvider>
    );
}
