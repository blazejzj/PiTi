import { Tabs } from "expo-router";

export default function HomeTabs() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
            }}
        >
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="training" options={{ title: "Training" }} />
            <Tabs.Screen name="food" options={{ title: "Food" }} />
            <Tabs.Screen name="stats" options={{ title: "Stats" }} />
            <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </Tabs>
    );
}
