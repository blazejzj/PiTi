import { View, Text, ScrollView, Platform, Pressable } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { DailyStatsHeader } from "../components/DailyStatsHeader";
import { ActiveWorkoutCard } from "../components/ActiveWorkoutCard";
import { DummyActiveWorkout,DummyLastSession, DummyStatsHeader } from "../../../lib/dummyDataTraining";

export default function TrainingScreen() {
    const [activeStatus, setActiveStatus] = useState<'active' | 'paused'>(DummyActiveWorkout.status === 'active' ? 'active' : 'paused');
    
    const handleTogglePause = () => {
        setActiveStatus(prev => {
            const newState = prev === 'active' ? 'paused' : 'active';
            console.log("Workout status changed to:", newState);
            return newState;
        });
    };

    const averageTimeString = `${DummyStatsHeader.averageTimeMinutes}min`;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView 
                className="flex-1 px-5 pt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 40 : 20 }}
            >
                <DailyStatsHeader 
                    date={DummyStatsHeader.currentDate}
                    sessionsThisWeek={DummyStatsHeader.sessionsThisWeek}
                    averageTimeMinutes={DummyStatsHeader.averageTimeMinutes}
                />
                
                <ActiveWorkoutCard
                    name={DummyActiveWorkout.name}
                    status={activeStatus}
                    duration={DummyActiveWorkout.duration}
                    exercises={DummyActiveWorkout.exercises}
                    onTogglePause={handleTogglePause}
                />
                
                <View className="mt-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <Text className="text-xl font-bold mb-3 text-neutral-800">Last Sessions</Text>
                    <View className="flex-row justify-between items-center pb-2 border-b border-gray-200">
                        <View>
                            <Text className="text-base font-semibold text-neutral-800">{DummyLastSession.name}</Text>
                            <Text className="text-xs text-neutral-500">{DummyLastSession.details}</Text>
                        </View>
                        <Text className="text-sm font-semibold text-neutral-500">{DummyLastSession.day}</Text>
                    </View>
                    <Pressable className="mt-3 py-2 items-center">
                        <Text className="text-sm font-semibold text-black">See all history</Text>
                    </Pressable>
                </View>

                <View className="mt-8 mb-10 p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <Text className="text-xl font-bold mb-3 text-neutral-800">Predefined Programs</Text>
                    
                    <View className="mb-4">
                        <Text className="text-lg font-semibold text-neutral-800">Full Body</Text>
                        <Text className="text-sm text-neutral-600">Cardio • 3x/week</Text>
                        <Pressable className="mt-2 py-2 bg-green-500 rounded-lg items-center w-24">
                            <Text className="text-sm font-bold text-white">Use Program</Text>
                        </Pressable>
                    </View>
                    
                    <View>
                        <Text className="text-lg font-semibold text-neutral-800">Core</Text>
                        <Text className="text-sm text-neutral-600">Strength • 3x/week</Text>
                        <Pressable className="mt-2 py-2 bg-green-500 rounded-lg items-center w-24">
                            <Text className="text-sm font-bold text-white">Use Program</Text>
                        </Pressable>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}