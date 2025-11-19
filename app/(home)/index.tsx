import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { account } from "../../src/services/appwrite/appwrite";
import { useProfile } from "../../src/features/profile/hooks/useProfile";
import ErrorView from "../../src/features/dashboard/screens/ErrorScreen";
import EmptyProfileScreen from "../../src/features/dashboard/screens/EmptyProfileScreen";
import DashboardScreen from "../../src/features/dashboard/screens/DashboardScreen";

// Container component -> fetch stuff and decide what to render.
// Views stay dumb and pretty for now
export default function DashboardContainer() {
    const router = useRouter();
    const { loading, profile, error, userId } = useProfile();

    const handleLogout = async () => {
        await account.deleteSession({ sessionId: "current" });
        Toast.show({ type: "success", text1: "Logged out" });
        router.replace("/(auth)/login");
    };

    const handleCreateProfile = () => {
        router.push("/(home)/profile/setup");
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <ErrorView
                message={String((error as any)?.message || error)}
                onLogout={handleLogout}
            />
        );
    }

    if (!profile) {
        return <EmptyProfileScreen onCreateProfile={handleCreateProfile} />;
    }

    return (
        <DashboardScreen
            profile={profile}
            userId={userId}
            onLogout={handleLogout}
        />
    );
}
