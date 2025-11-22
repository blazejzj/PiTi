import { View, Text, Pressable } from "react-native";
import { useState } from "react";

export default function StatsNotAddedScreen() {
    const funFacts = [
        "Fun fact: 100% of people who don't go to the gym… don't go to the gym.",
        "Fun fact: Squats are just you sitting down and standing up like a functional adult.",
        "Fun fact: Cardio is just running from your problems, but organized.",
        "Fun fact: Protein powder is basically adult hot chocolate.",
        "Fun fact: Leg day only hurts until you sit down. Or stand up. Or move.",
        "Fun fact: Burpees were invented by someone who hated happiness.",
        "Fun fact: Fitness influencers eat 6 meals a day. You eat 6 snacks a day. Same thing.",
        "Fun fact: If you drop your dumbbell, gravity PRs instantly.",
        "Fun fact: The bench press is just a fancy way to push the world away from you.",
        "Fun fact: Water is 0 calories so technically you're losing weight while drinking it.",
        "Fun fact: Rest day is the most important day. And the easiest to commit to.",
    ];

    const getRandomFact = () => {
        const index = Math.floor(Math.random() * funFacts.length);
        return funFacts[index];
    };

    const [fact, setFact] = useState(getRandomFact);

    return (
        <View className="flex-1 bg-white p-safe items-center justify-center px-8">
            <Text className="text-2xl font-bold mb-4">Statistics</Text>

            <Text className="text-center text-neutral-300 text-xs mb-8">
                (Stats coming soon. Gains coming sooner.)
            </Text>

            <Text className="text-center text-neutral-400 italic text-sm mb-4">
                {fact}
            </Text>

            <Pressable
                onPress={() => setFact(getRandomFact())}
                className="mt-3 px-4 py-2 bg-green-600 rounded-xl"
            >
                <Text className="text-white font-semibold text-sm">
                    Get another fun fact
                </Text>
            </Pressable>
        </View>
    );
}
