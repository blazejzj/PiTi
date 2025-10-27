import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export default function HomeTabs() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: "#41e36f",
                tabBarInactiveTintColor: "#9ca3af",
                tabBarStyle: {
                    backgroundColor: "white",
                    borderTopWidth: 0,
                    elevation: 5,
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                    marginBottom: 15,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                },
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = "home";

                    switch (route.name) {
                        case "index":
                            iconName = focused ? "home" : "home-outline";
                            break;
                        case "training":
                            iconName = focused ? "barbell" : "barbell-outline";
                            break;
                        case "food":
                            iconName = focused
                                ? "fast-food"
                                : "fast-food-outline";
                            break;
                        case "stats":
                            iconName = focused
                                ? "stats-chart"
                                : "stats-chart-outline";
                            break;
                        case "profile":
                            iconName = focused ? "person" : "person-outline";
                            break;
                    }

                    return (
                        <View className="items-center justify-center">
                            <Ionicons
                                name={iconName}
                                size={size}
                                color={color}
                            />
                        </View>
                    );
                },
            })}
        >
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="training" options={{ title: "Training" }} />
            <Tabs.Screen name="food" options={{ title: "Food" }} />
            <Tabs.Screen name="stats" options={{ title: "Stats" }} />
            <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </Tabs>
    );
}
