import {
    View,
    Text,
    ScrollView,
    Platform,
    Alert,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, Control } from "react-hook-form";
import Button from "../../../components/Button";
import FormInput from "../../../components/FormInput";
import { useWorkoutDraft } from "../state/useWorkoutDraft";

type AddExerciseForm = {
    exerciseName: string;
    sets: string;
    reps: string;
    weight: string;
};

export default function AddExerciseScreen() {
    const router = useRouter();
    const { control, handleSubmit, reset } = useForm<AddExerciseForm>();
    const { addExercise } = useWorkoutDraft();

    const handleSaveExercise = (data: AddExerciseForm) => {
        const numSets = Math.round(parseFloat(data.sets)) || 1;
        const defaultReps = Math.round(parseFloat(data.reps)) || 0;
        const defaultWeight = parseFloat(data.weight) || 0;

        if (!data.exerciseName) {
            Alert.alert("Please enter an exercise name.");
            return;
        }

        const plannedSets = Array.from({ length: numSets }, (_, i) => ({
            setNumber: i + 1,
            repetitions: defaultReps,
            weightKg: defaultWeight,
        }));

        const newDraftExercise = {
            exerciseName: data.exerciseName,
            sets: plannedSets,
        };

        addExercise(newDraftExercise);
        reset();
        if (router.canGoBack()) router.back();
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 px-5">
                    <ScrollView
                        className="flex-1 p-5"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: Platform.OS === "ios" ? 40 : 20,
                        }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="mb-20" />
                        <Text className="text-xl font-bold text-neutral-800 mb-4 px-5">
                            Manual Exercise Entry
                        </Text>

                        <FormInput
                            control={control as Control<AddExerciseForm>}
                            name="exerciseName"
                            label="Exercise Name"
                            rules={{ required: "Name is required" }}
                            placeholder="e.g. Barbell Squat, Push-up"
                        />

                        <View className="flex-row justify-between mb-4">
                            <View className="w-1/3 pr-2">
                                <FormInput
                                    control={
                                        control as Control<AddExerciseForm>
                                    }
                                    name="sets"
                                    label="Sets"
                                    placeholder="3"
                                    keyboardType="numeric"
                                    rules={{
                                        required: "Sets is required",
                                        validate: (value: string) =>
                                            parseInt(value, 10) > 0 ||
                                            "Sets must be bigger than 0",
                                    }}
                                />
                            </View>
                            <View className="w-1/3 px-1">
                                <FormInput
                                    control={
                                        control as Control<AddExerciseForm>
                                    }
                                    name="reps"
                                    label="Reps"
                                    placeholder="10"
                                    keyboardType="numeric"
                                    rules={{
                                        validate: (value: string) =>
                                            parseInt(value, 10) > 0 ||
                                            "Reps must be bigger than 0",
                                    }}
                                />
                            </View>
                            <View className="w-1/3 pl-2">
                                <FormInput
                                    control={
                                        control as Control<AddExerciseForm>
                                    }
                                    name="weight"
                                    label="Weight (kg)"
                                    placeholder="80"
                                    keyboardType="numeric"
                                    rules={{
                                        validate: (value: string) =>
                                            parseInt(value, 10) >= 0 ||
                                            "Weight must be bigger than 0",
                                    }}
                                />
                            </View>
                        </View>

                        <View className="mb-10" />

                        <Button
                            title="Add Exercise to a workout session"
                            variant="primary"
                            onPress={handleSubmit(handleSaveExercise)}
                            className="w-full rounded-xl"
                            textClassName="text-lg font-bold text-white"
                        />
                        <View className="mb-10" />
                        <Button
                            title="Cancel Entry"
                            variant="secondary"
                            onPress={() => router.back()}
                            className="w-full rounded-xl py-4 border-2 border-green-500 bg-white"
                            textClassName="text-md font-medium text-green-700"
                        />
                        <View className="mb-10" />
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
