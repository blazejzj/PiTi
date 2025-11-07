import { View, Text, ScrollView, Platform, Pressable, Alert} from "react-native";
import Button from '../../../components/Button'; 
import { useRouter} from "expo-router";
import { useEffect, useState } from "react";
//import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DailyStatsHeader } from "../components/DailyStatsHeader";
import { ActiveWorkoutCard } from "../components/ActiveWorkoutCard";
import { DummyActiveWorkout,DummyLastSession, DummyStatsHeader } from "../../../lib/dummyDataTraining";
import { workoutRepo } from "../repository/workoutRepo";
import { Workout } from "../models";


const DUMMY_USER_ID = "user_abc123"; 

export default function TrainingScreen() {
    const router = useRouter();
    //const isFocused = useIsFocused();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const handleFetchWorkouts = async () => {
        if (!DUMMY_USER_ID) return;
        
        setIsLoading(true);
        try {
            const fetchedWorkouts = await workoutRepo.list(DUMMY_USER_ID);
            setWorkouts(fetchedWorkouts);
        } catch (error) {
            console.error("Failed to fetch workouts:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDeleteWorkout = (workoutId: string, workoutName: string) => {
    Alert.alert(
        "Confirm Deletion",
        `Are you sure you want to delete the plan: "${workoutName}"? This cannot be undone.`,
        [
            {
                text: "Cancel",
            },
            {
                text: "Delete",
                onPress: async () => {
                    try {
                        await workoutRepo.deleteById(workoutId);
                        console.log(`Workout ${workoutId} deleted.`);
                        
                        handleFetchWorkouts(); 
                    } catch (error) {
                        console.error("Failed to delete workout:", error);
                        Alert.alert("Error", "Could not delete workout plan.");
                    }
                }
            }
        ]
    );
};
    /*useEffect(() => {
        if (isFocused) {
            handleFetchWorkouts();
        }
    }, [isFocused]);*/
    useEffect(() => {
        handleFetchWorkouts();
    }, []);

    //TODO: Replace DummyActiveWorkout with real active workout data from state/repo, need new screen for that
    const [activeStatus, setActiveStatus] = useState<'active' | 'paused'>(DummyActiveWorkout.status === 'active' ? 'active' : 'paused');
    const handleTogglePause = () => {
        setActiveStatus(prev => {
            const newState = prev === 'active' ? 'paused' : 'active';
            console.log("Workout status changed to:", newState);
            return newState;
        });
    };
    const averageTimeString = `${DummyStatsHeader.averageTimeMinutes}min`;

    const handleAddSession = () => {
        router.push('/training/addTrainingSession'); 
    };

    const lastSession = workouts[0];

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
                    <Text className="text-xl font-bold mb-3 text-neutral-800">Last added sessions</Text>
                    
                    {workouts.length > 0 ? (
                      workouts.map((session, index) => (
                        <Pressable 
                         key={session.$id} 
                        className={`flex-row justify-between items-center py-3 ${index < workouts.length - 1 ? 'border-b border-gray-200' : ''}`}
                //TODO: Navigate to session details screen 
                onPress={() => {
                    Alert.alert("TODO", "This will take you to the interactive workout session screen!");
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
                <Text className="text-sm font-semibold text-green-500">Ready</Text>
            </Pressable>
        ))
    ) : (
        <Text className="text-base text-neutral-500">No sessions recorded yet.</Text>
    )}

                    {/* TODO: Add navigation to full history screen */}
                    <Pressable className="mt-3 py-2 items-center">
                        <Text className="text-sm font-semibold text-black">See all history</Text>
                    </Pressable>
                </View>
                <View className="mt-6" />
                <Button
                            title="+ Add session"
                            variant="primary" 
                            onPress={handleAddSession}
                            className="w-full rounded-xl" 
                            textClassName="text-lg font-bold text-white" 
                        />

            </ScrollView>
        </SafeAreaView>
    );
}