import { View, Text, ScrollView, Platform, Pressable, Alert} from "react-native";
import Button from '../../../components/Button';
import { useRouter, useFocusEffect} from "expo-router";
import { useEffect, useState, useMemo, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { workoutRepo } from "../repository/workoutRepo";
import { Workout } from "../models";
import { DailyStatsHeader } from "../components/DailyStatsHeader";


const DUMMY_USER_ID = "user_abc123"; 

export default function TrainingScreen() {
    const router = useRouter();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const handleFetchWorkouts = useCallback(async () => {
        if (!DUMMY_USER_ID) return;
        
        setIsLoading(true);
        try {
            const fetchedWorkouts = await workoutRepo.list(DUMMY_USER_ID);
            fetchedWorkouts.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
            setWorkouts(fetchedWorkouts);
        } catch (error) {
            console.error("Failed to fetch workouts:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            handleFetchWorkouts();
        }, [handleFetchWorkouts])
    );
    
    const handleDeleteWorkout = (workoutId: string, workoutName: string) => {
    Alert.alert(
        "Confirm Deletion",
        `Are you sure you want to delete the session: "${workoutName}"? This cannot be undone.`,
        [
            { text: "Cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await workoutRepo.deleteById(workoutId);
                        handleFetchWorkouts();
                    } catch (error) {
                        console.error("Failed to delete workout:", error);
                        Alert.alert("Error", "Could not delete workout session.");
                    }
                }
            }
        ]
    );
};
    
    const { 
        currentDateString, 
        sessionsThisWeek, 
        averageTimeMinutes,
        activeWorkouts, 
        finishedWorkouts 
    } = useMemo(() => {
        const today = new Date();
        const oneWeekAgo = today.getTime() - (7 * 24 * 60 * 60 * 1000);

        const currentDateString = today.toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
        });

        const finished = workouts.filter(w => !!w.endedAt);
        const activeWorkouts = workouts.filter(w => !w.endedAt).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
        
        const sessionsThisWeek = workouts.filter(w => 
            new Date(w.startedAt).getTime() >= oneWeekAgo
        ).length;

        const completedWorkouts = finished;
        const totalTimeMinutes = completedWorkouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);
        
        const averageTimeMinutes = completedWorkouts.length > 0
            ? Math.round(totalTimeMinutes / completedWorkouts.length)
            : 0;

        return { 
            currentDateString, 
            sessionsThisWeek, 
            averageTimeMinutes, 
            activeWorkouts,
            finishedWorkouts: finished 
        };
    }, [workouts]);

    const handleAddSession = () => {
        router.push('/training/addTrainingSession'); 
    };

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <Text>Loading workouts...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView 
                className="flex-1 px-5 pt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 40 : 20 }}
            >
                <DailyStatsHeader 
                    date={currentDateString}
                    sessionsThisWeek={sessionsThisWeek}
                    averageTimeMinutes={averageTimeMinutes}
                />
                
                <View className="mb-6">
                    <Text className="text-xl font-bold text-neutral-800 mb-3">Active Sessions</Text>

                    {activeWorkouts.length > 0 ? (
                        activeWorkouts.map((session, index) => (
                            <Pressable
                                key={session.$id}
                                className={`p-4 bg-green-50 border border-green-300 rounded-xl shadow-sm ${index > 0 ? 'mt-3' : ''}`}
                                onPress={() => router.push({ 
                                    pathname: '/training/activeWorkout', 
                                    params: { workoutId: session.$id }
                                })}
                            >
                                <Text className="text-lg font-bold text-green-800">{session.name}</Text>
                                <Text className="text-sm text-green-600 mt-1">
                                    Started: {new Date(session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                                <Text className="text-xs text-green-600 mt-2">Tap to start/resume.</Text>
                            </Pressable>
                        ))
                    ) : (
                        <View className="p-4 bg-gray-100 border border-gray-300 rounded-xl">
                            <Text className="text-base text-neutral-600">No active session running.</Text>
                            <Text className="text-sm text-neutral-500 mt-1">Start a new workout below.</Text>
                        </View>
                    )}
                </View>
                
                <View className="mt-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <Text className="text-xl font-bold mb-3 text-neutral-800">Last added sessions</Text>
                    
                    {finishedWorkouts.length > 0 ? (
                        finishedWorkouts.map((session, index) => {
                            const statusClass = "text-sm font-semibold text-gray-500";
                            const statusText = "Completed";

                            return (
                                <Pressable 
                                    key={session.$id} 
                                    className={`flex-row justify-between items-center py-3 ${index < finishedWorkouts.length - 1 ? 'border-b border-gray-200' : ''}`}
                                    onPress={() => {
                                        router.push({ 
                                            pathname: '/training/activeWorkout',
                                            params: { workoutId: session.$id },
                                        })
                                    }}
                                    onLongPress={() => {
                                        handleDeleteWorkout(session.$id, session.name);
                                    }}
                                >
                                    <View>
                                        <Text className="text-base font-semibold text-neutral-800">{session.name}</Text>
                                        <Text className="text-xs text-neutral-500">
                                            {new Date(session.startedAt).toLocaleDateString()} at {new Date(session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>
                                    
                                    <Text className={statusClass}>{statusText}</Text>
                                </Pressable>
                            );
                        })
                    ) : (
                        <Text className="text-base text-neutral-500">No finished sessions recorded yet.</Text>
                    )}

                    <Pressable className="mt-3 py-2 items-center">
                        <Text className="text-sm font-semibold text-black">See all history</Text>
                    </Pressable>
                </View>

                <View className="mt-6" />
                <Button
                    title="+ Add session"
                    onPress={handleAddSession}
                    className="w-full rounded-xl bg-green-600"
                    textClassName="text-lg font-bold text-white" 
                />
                <View className="mb-10" />

            </ScrollView>
        </SafeAreaView>
    );
}