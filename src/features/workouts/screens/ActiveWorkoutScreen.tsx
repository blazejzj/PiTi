import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, ScrollView, Pressable, Alert, Platform } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { workoutRepo } from "../repository/workoutRepo";
import type { Workout, WorkoutExercise, WorkoutSet } from "../models";

const ActiveWorkoutScreen = () => {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const router = useRouter();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [setsByExercise, setSetsByExercise] = useState<Record<string, WorkoutSet[]>>({});

  const loadData = async () => {
    if (!workoutId) return;

    try {
      const w = await workoutRepo.get(workoutId);
      const ex = await workoutRepo.listExercises(workoutId);

      const setsMap: Record<string, WorkoutSet[]> = {};
      for (const e of ex) {
        setsMap[e.$id] = await workoutRepo.listSets(e.$id);
      }

      setWorkout(w);
      setExercises(ex);
      setSetsByExercise(setsMap);
    } catch (error) {
      console.error("Failed to load workout data:", error);
      Alert.alert("Failed to load workout data");
    }
  };

  useEffect(() => {
    loadData();
  }, [workoutId]);

  if (!workout) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Loading session...</Text>
      </SafeAreaView>
    );
  }

  const formatStartedAt = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return "-";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 40 : 20 }}
      >
        <Text className="text-xl font-bold text-neutral-800 mb-4">{workout.name}</Text>

        <Text className="text-sm text-neutral-500 mb-6">
          Duration: {workout.durationMinutes ?? "-"} min | Started: {formatStartedAt(workout.startedAt)}
        </Text>

        {workout.notes && (
          <View className="mb-6 p-3 bg-gray-100 rounded-lg">
            <Text className="text-sm text-neutral-600">{workout.notes}</Text>
          </View>
        )}

        <View className="p-4 border border-green-700 rounded-xl bg-green-50 mb-6">
          <Text className="text-lg font-bold text-neutral-800 mb-3">
            Exercises: ({exercises.length})
          </Text>

          {exercises.map((exercise, index) => {
            const exerciseSets = setsByExercise[exercise.$id] || [];
            const firstSet = exerciseSets[0];

            const summaryText = firstSet
              ? `${exerciseSets.length} sets • ${firstSet.repetitions} reps • ${firstSet.weightKg ?? 0} kg`
              : `${exerciseSets.length} sets`;

            return (
              <View
                key={exercise.$id}
                className={`py-2 ${index < exercises.length - 1 ? 'border-b border-blue-200' : ''}`}
              >
                <View className="flex-1">
                  <Text className="font-semibold text-base text-neutral-800">{exercise.exerciseName}</Text>
                  <Text className="text-sm text-neutral-600">{summaryText}</Text>

                  {exerciseSets.map((set) => (
                    <View key={set.$id} className="flex-row justify-between mt-1 pl-2">
                      <Text className="text-sm text-neutral-700">Set {set.setNumber}</Text>
                      <Text className="text-sm text-neutral-700">
                        {set.repetitions} reps {set.weightKg ? ` ${set.weightKg}kg` : ""}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}

          {exercises.length === 0 && (
            <Text className="text-sm text-neutral-500">No exercises in this workout.</Text>
          )}
        </View>

        <Pressable
          onPress={() => router.back()}
          className="w-full rounded-xl py-4 border-2 border-green-500 bg-white items-center"
        >
          <Text className="text-md font-medium text-green-700">Back to Workouts</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ActiveWorkoutScreen;