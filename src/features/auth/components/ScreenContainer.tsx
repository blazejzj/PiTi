import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function ScreenContainer({
    children,
    className,
    style,
    ...rest
}: ViewProps & { className?: string }) {
    const insets = useSafeAreaInsets();

    return (
        <View
            className={`flex-1 bg-white ${className}`}
            style={[
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                },
                style,
            ]}
            {...rest}
        >
            {children}
        </View>
    );
}
