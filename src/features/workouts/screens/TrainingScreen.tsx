import { Text, View } from "react-native";
import { useRouter } from "expo-router";


export default function TrainingScreen() {
    const router = useRouter();
    return (
        <View>
            <Text>Training tab</Text>
        </View>
    );
}
