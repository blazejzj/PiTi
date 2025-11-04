import { router } from "expo-router";
import { useRouter } from "expo-router";
import { useProfile } from "../hooks/useProfile";
import { Text, View, Pressable, ScrollView } from "react-native";
import { ActivityIndicator } from "react-native";
import Button from "../../../components/Button";
import { SectionCard } from "../components/SectionCard";
import InfoItem from "../components/InfoItem";

export default function ProfileScreen() {
    const router = useRouter();
    const { loading, profile, error } = useProfile();
    const userName = "Ola Nordmann"; // just for now,..TODO: fetch dynamic name!

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
            className="flex-1 bg-white p-safe"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}
        >
            <View className="bg-white">
                {/* Heeader section here. Cant fetch dynamic user name?? Ask later. */}
                <View className="items-center py-8 bg-white">
                    <View className="w-20 h-20 rounded-full bg-neutral-200 mb-4" />
                    <Text className="text-xl font-semibold mb-1">
                        Ola Nordmann
                    </Text>
                </View>

                {/* Stats bar here-  TODO: dynamic nymber of sessions gotta fix that*/}
                <View className="flex-row justify-around border-t border-b border-neutral-400 py-4 bg-white">
                    <InfoItem
                        label="Vekt"
                        value={`${profile.weight_kg ?? "N/a"} kg`}
                        className=""
                    />
                    <InfoItem
                        label="Kalorimål"
                        value={`${profile.daily_kcal_target ?? "N/A"}`}
                    />
                    <InfoItem label="Økter" value="32" />
                </View>

                {/*Personlige mål section here,, TODO: gotta fix personal goals dynamic too. Easy - 5kg to illustrate now*/}
                <SectionCard title="Personlige mål">
                    <View className="gap-3 border-b border-neutral-400 pb-5">
                        <View className="rounded-2xl py-3 items-center bg-neutral-200 mx-5">
                            <Text className="font-semibold">Vektmål</Text>
                            <Text className="text-neutral-600">
                                {profile.weight_kg
                                    ? `${
                                          profile.weight_kg - 5
                                      } kg innen 12.12.2025`
                                    : "Ingen mål satt"}
                            </Text>
                        </View>

                        <View className="rounded-2xl bg-neutral-200 py-3 px-5 items-center mx-5">
                            <Text className="font-semibold">Steps</Text>
                            <Text className="text-neutral-600">
                                50k innen 12.12.2025
                            </Text>
                        </View>
                    </View>
                </SectionCard>

                {/* KroppsinfoSection here...Fixed BMI calculation too. */}
                <SectionCard title="Kroppsinfo">
                    <View className="flex-row justify-around px-5 ">
                        <InfoItem
                            label="Vekt"
                            value={`${profile.weight_kg ?? "N/A"} kg`}
                            className="bg-neutral-200 rounded-3xl min-width-[500px]"
                        />
                        <InfoItem
                            label="Alder"
                            value={`${profile.age ?? "N/A"} år`}
                            className="bg-neutral-200 rounded-3xl min-width-[80px]"
                        />
                    </View>
                    <View className="flex-row justify-around px-5 mt-4 border-b border-neutral-400 pb-6">
                        <InfoItem
                            label="BMI"
                            value={bmi}
                            className="bg-neutral-200 rounded-3xl min-width-[200px]"
                        />
                        <InfoItem
                            label="Stats"
                            value="N/A"
                            className="bg-neutral-200 rounded-3xl min-width-[200px]"
                        />
                    </View>
                </SectionCard>

                {/*Innstillinger section here*/}

                <SectionCard title="Innstillinger">
                    <View className="gap-3 px-6 ">
                        <Pressable className="rounded-2xl bg-neutral-100 py-3 px-5">
                            <Text className="font-semibold text-center">
                                Påminnelser
                            </Text>
                        </Pressable>
                        <Pressable className="rounded-2xl bg-neutral-100 py-3 px-5">
                            <Text className="font-semibold text-center">
                                Meldinger
                            </Text>
                        </Pressable>
                        <Pressable className="rounded-2xl bg-neutral-100 py-3 px-5">
                            <Text className="font-semibold text-center">
                                Eksporter data
                            </Text>
                        </Pressable>
                        <Pressable className="rounded-2xl bg-neutral-100 py-3 px-5">
                            <Text className="font-semibold text-center">
                                Personvern
                            </Text>
                        </Pressable>
                    </View>
                </SectionCard>

                {/* Edit/rediger profile..  */}

                <View className="items-center mt-10">
                    <Button
                        title="Rediger profil"
                        variant="primary"
                        onPress={() => router.push("/(home)/profile/setup")}
                        className="w-3/4 rounded-2xl py-4"
                    />
                </View>
            </View>
        </ScrollView>
    );
}
