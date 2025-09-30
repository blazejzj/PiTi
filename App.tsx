import "./global.css";
import { Text, View } from "react-native";
import WelcomeScreen from "./src/features/auth/screens/WelcomeScreen";

export default function App() {
    return (
        <View className="w-screen h-screen bg-white">
            <WelcomeScreen />
        </View>
    );
}
