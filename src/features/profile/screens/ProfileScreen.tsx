import { router } from "expo-router";
import { useRouter } from "expo-router";
import { useProfile } from "../hooks/useProfile";
import { Text, View, Pressable, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import Button from "../../../components/Button";
import { SectionCard } from "../components/SectionCard";
import InfoItem from "../components/InfoItem";
import { account } from "../../../services/appwrite/appwrite";
import { workoutRepo } from "../../workouts/repository/workoutRepo";

export default function ProfileScreen() {
    const router = useRouter();
    const { loading, profile, error } = useProfile();
    //const userName = "Ola Nordmann";
    const [userName, setUserName] = useState<string>("user");
    const [sessionCount, setSessionCount] = useState<number | null>(null);

    // confused with tables - and name fetching, No field for user name? . Fethcin user name from email, workaround. Better than hardcoded name.
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const currentUser = await account.get();
                const name = currentUser.email.split("@")[0];
                setUserName(name);
            } catch (error) {
                console.error("Error fetching user name:", error);
            }
        };

        fetchUserName();
    }, []);

    // just grab actual workout sessions count for this user
    useEffect(() => {
        const fetchSessions = async () => {
            if (!profile?.user_id) return;
            try {
                const workouts = await workoutRepo.list(profile.user_id);
                setSessionCount(workouts.length);
            } catch (err) {
                console.error("Error fetching sessions:", err);
                setSessionCount(null);
            }
        };

        fetchSessions();
    }, [profile?.user_id]);

    if (!profile) return null; // otherwise profile might possibly be null...

    {
        /* NOTE: AppWrite typos for height_cm was fixed, BMI works fine now. All other fields have also been corrected. updated models.ts too.  */
    }
    const bmi =
        profile.height_cm && profile.weight_kg
            ? (
                  profile.weight_kg /
                  ((profile.height_cm / 100) * (profile.height_cm / 100))
              ).toFixed(1)
            : "N/A";

    return (
        <ScrollView
            className="flex-1 bg-neutral-50 p-safe"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50, paddingTop: 80 }}
        >
            <View className="px-4">
                {/* Heeader section here. Cant fetch dynamic user name?? Ask later. */}
                <View className="items-center py-8 bg-white rounded-3xl mb-6 shadow-sm">
                    <View
                        className="w-20 h-20 rounded-full bg-neutral-100 mb-4 items-center justify-center"
                        style={{ borderColor: "#41e36f", borderWidth: 2 }}
                    >
                        <Text className="text-2xl font-bold theme-text-color">
                            {userName ? userName.charAt(0).toUpperCase() : "U"}
                        </Text>
                    </View>
                    <Text className="text-2xl font-semibold mb-1">
                        {userName}
                    </Text>
                    {/* could we potentially have a list of motivational quotes here? */}
                    <Text className="text-sm text-neutral-500">
                        Have a wonderful day!
                    </Text>
                </View>

                {/* Stats bar here-  TODO: dynamic nymber of sessions gotta fix that*/}
                <View className="flex-row justify-between bg-white rounded-3xl px-4 py-4 mb-8 shadow-sm border border-neutral-200">
                    <InfoItem
                        label="Weight"
                        value={
                            profile.weight_kg
                                ? `${profile.weight_kg} kg`
                                : "N/A"
                        }
                        className="flex-1 items-center"
                    />
                    <InfoItem
                        label="Calorie Goal"
                        value={
                            profile.daily_kcal_target
                                ? `${profile.daily_kcal_target} kcal`
                                : "N/A"
                        }
                        className="flex-1 items-center"
                    />
                    <InfoItem
                        label="Sessions"
                        value={
                            sessionCount !== null ? `${sessionCount}` : "..."
                        }
                        className="flex-1 items-center"
                    />
                </View>

                {/*Personlige mål section here,, TODO: gotta fix personal goals dynamic too. Easy - 5kg to illustrate now*/}
                <SectionCard title="Personal Goals">
                    <View className="gap-3 border-b border-neutral-200 pb-5">
                        <View className="rounded-2xl py-3 items-center bg-white mx-5 border border-neutral-200">
                            <Text className="font-semibold">Weight Goal</Text>
                            <Text className="text-neutral-600">
                                {profile.target_weight_kg
                                    ? `${profile.target_weight_kg} kg`
                                    : "No goal set"}
                            </Text>
                        </View>

                        <View className="rounded-2xl bg-white py-3 px-5 items-center mx-5 border border-neutral-200">
                            <Text className="font-semibold">Steps</Text>
                            <Text className="text-neutral-600">
                                50k by 12.12.2025
                            </Text>
                        </View>
                    </View>
                </SectionCard>

                {/* KroppsinfoSection here...Fixed BMI calculation too. */}
                <SectionCard title="Body Info">
                    <View className="flex-row px-4 gap-3">
                        <InfoItem
                            label="Weight"
                            value={
                                profile.weight_kg
                                    ? `${profile.weight_kg} kg`
                                    : "N/A"
                            }
                            className="bg-white rounded-3xl flex-1 border border-neutral-200"
                        />
                        <InfoItem
                            label="Age"
                            value={profile.age ? `${profile.age} years` : "N/A"}
                            className="bg-white rounded-3xl flex-1 border border-neutral-200"
                        />
                    </View>
                    <View className="flex-row px-4 mt-4 border-b border-neutral-200 pb-6 gap-3">
                        <InfoItem
                            label="BMI"
                            value={bmi}
                            className="bg-white rounded-3xl flex-1 border border-neutral-200"
                        />
                        <InfoItem
                            label="Stats"
                            value="N/A"
                            className="bg-white rounded-3xl flex-1 border border-neutral-200"
                        />
                    </View>
                </SectionCard>

                <SectionCard title="Settings">
                    <View className="gap-3 px-4 ">
                        <Pressable className="rounded-2xl bg-white py-3 px-5 border border-neutral-200">
                            <Text className="font-semibold text-center">
                                Reminders
                            </Text>
                        </Pressable>
                        <Pressable className="rounded-2xl bg-white py-3 px-5 border border-neutral-200">
                            <Text className="font-semibold text-center">
                                Messages
                            </Text>
                        </Pressable>
                        <Pressable className="rounded-2xl bg-white py-3 px-5 border border-neutral-200">
                            <Text className="font-semibold text-center">
                                Export Data
                            </Text>
                        </Pressable>
                        <Pressable className="rounded-2xl bg-white py-3 px-5 border border-neutral-200">
                            <Text className="font-semibold text-center">
                                Privacy
                            </Text>
                        </Pressable>
                    </View>
                </SectionCard>

                {/* Edit/rediger profile..  */}

                <View className="items-center mt-10 pb-10">
                    <Button
                        title="Edit Profile"
                        variant="primary"
                        onPress={() => router.push("/(home)/profile/edit")}
                        className="w-3/4 rounded-2xl py-4"
                    />
                </View>
            </View>
        </ScrollView>
    );
}
