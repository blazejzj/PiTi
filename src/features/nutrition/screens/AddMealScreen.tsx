import { Pressable, Text, View, ScrollView, Platform, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import Button from "../../../components/Button"; 
import FormInput from "../../../components/FormInput"; 
import { useState } from "react";

type MealFormInputs = {
    mealName: string;
    notes: string;
};

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export default function AddMealScreen() {
    const router = useRouter();

    const [selectedMealType] = useState<string>('Breakfast');
    const [selectedTime] = useState<string>('08:00');
    
    const addedFoodItems = [{ name: "Oats", kcal: 90 }];
    const totalKcal = 90;

    const { control, handleSubmit } = useForm<MealFormInputs>({
        defaultValues: { mealName: "", notes: "" },
    });

    const handleAddFoodItem = () => {
        router.push("/food/scanItem"); 
    };
    
    const onSubmit = () => {
        console.log("Meal data submitted; no real data handling rn");
        router.back();
    };

    const handleAddMeal = handleSubmit(onSubmit);

    return (
        <View className="flex-1 bg-white px-5">
            <ScrollView 
                className="flex-1 px-5" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 40 : 20 }}
            >
                <Pressable
                    onPress={() => router.back()}
                    className="mb-8 mt-12 self-start"
                >
                    <Text className="font-semibold">← Go Back</Text>
                </Pressable>

                <View className="w-full self-center flex gap-5">
                    
                    <FormInput
                        control={control}
                        name="mealName"
                        label="Name of your meal"
                        placeholder="Chicken salad etc."
                        autoCapitalize="words"
                    />

                    <View className="flex gap-2">
                        <Text className="text-base font-medium text-neutral-700">Meal Type</Text>
                        <Pressable 
                            onPress={() => console.log('Open Meal Type Selector')}
                            className="p-3 rounded-xl border border-neutral-200 bg-neutral-100 flex-row justify-between items-center"
                        >
                            <Text className="text-neutral-900 text-base">{selectedMealType}</Text>
                            <Text>▼</Text>
                        </Pressable>
                    </View>

                    <View className="flex gap-2">
                        <Text className="text-base font-medium text-neutral-700">Time</Text>
                        <Pressable 
                            onPress={() => console.log('Open Time Selector')}
                            className="p-3 rounded-xl border border-neutral-200 bg-neutral-100 flex-row justify-between items-center"
                        >
                            <Text className="text-neutral-900 text-base">{selectedTime}</Text>
                            <Text>▼</Text>
                        </Pressable>
                    </View>

                    <View className="flex gap-2">
                        <Text className="text-base font-medium text-neutral-700">Food Items</Text>

                        <Button
                            onPress={handleAddFoodItem}
                            title="+ Add or Scan More Food Items"
                            variant="primary"
                            className="w-full rounded-xl py-4 mb-2"
                            textClassName="text-lg font-bold text-black"
                        />

                        {addedFoodItems.map((item, index) => (
                            <View key={index} className="flex-row justify-between items-center px-1">
                                <Text className="text-neutral-700">{item.name}</Text>
                                <Text className="text-neutral-700 font-semibold">{item.kcal}kcal</Text>
                            </View>
                        ))}

                    </View>
                    
                    <FormInput
                        control={control}
                        name="notes"
                        label="Notes"
                        placeholder="..."
                    />

                    <View className="flex gap-2 mt-4">
                        <Text className="text-base font-medium text-neutral-700">Total kcal</Text>
                        <TextInput
                            value={String(totalKcal)} 
                            editable={false} 
                            className="p-3 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-900 text-base text-right font-bold"
                        />
                    </View>

                </View>

                <View className="mt-8 mb-10">
                    <Button
                        title="+ Add Meal"
                        variant="primary"
                        onPress={handleAddMeal}
                        textClassName="text-lg font-bold text-white"
                        className="w-full rounded-xl py-4"
                    />
                </View>
            </ScrollView>
        </View>
    );
}
