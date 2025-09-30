import Button from "../../../components/Button";
import { View } from "react-native";

type Props = {
    onRegister: () => void;
    onLogin: () => void;
    className?: string;
};

export function AuthButtons({ onRegister, onLogin, className }: Props) {
    return (
        <View className={`mt-16 gap-6 ${className ?? ""}`}>
            <Button
                title="Get started!"
                variant="primary"
                onPress={onRegister}
            />
            <Button
                title="Already have an account?"
                variant="secondary"
                onPress={onLogin}
            />
        </View>
    );
}
