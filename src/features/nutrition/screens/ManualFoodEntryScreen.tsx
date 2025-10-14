import { useForm } from "react-hook-form";
import { Pressable, Text, View, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import Button from "../../../components/Button"; 
import FormInput from "../../../components/FormInput"; 

type CustomFoodInputs = {
    foodName: string;
    kcal: string;
    carbs: string;
    protein: string;
    fat: string;
};

export default function ManualFoodEntryScreen() {
    const router = useRouter();

    const { control, handleSubmit } = useForm<CustomFoodInputs>({
        defaultValues: { 
            foodName: "", 
            kcal: "", 
            carbs: "", 
            protein: "", 
            fat: "" 
        },
    });

    const onSubmit = (data: CustomFoodInputs) => {
    
        console.log("Custom Food Data Submitted (Ready to save and return):", data);
        
        // todo: Save the custom food item to state/database/update addfooditem form.
        router.push("/food/addMeal"); 
    };

    const handleAddCustomFood = handleSubmit(onSubmit);

    return (
        <View className="flex-1 bg-white px-5">
            <ScrollView 
                className="flex-1" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 40 : 20 }}
            >
                <Pressable
                    onPress={() => router.back()}
                    className="mb-8 mt-12 self-start"
                >
                    <Text className="font-semibold text-lg text-neutral-700">← Back to Scan</Text>
                </Pressable>

                <Text className="font-bold text-3xl mb-6 text-center">Add Custom Food Item</Text>

                <View className="w-full self-center flex gap-5">
                    
                    <FormInput
                        control={control}
                        name="foodName"
                        label="Food Name (Required)"
                        placeholder="e.g. Homemade Protein Bar"
                        autoCapitalize="words"
                        rules={{ required: "Name is required" }}
                    />

                    <Text className="text-xl font-bold mt-4 mb-2 text-neutral-700">Nutritional Values (Per 100g)</Text>
                    
                    <FormInput
                        control={control}
                        name="kcal"
                        label="Total Calories (kcal)"
                        placeholder="e.g. 350"
                        keyboardType="numeric"
                        rules={{ required: "Kcal is required" }}
                    />

                    <FormInput
                        control={control}
                        name="protein"
                        label="Protein (grams)"
                        placeholder="e.g. 25"
                        keyboardType="numeric"
                        rules={{ required: "Protein is required" }}
                    />
                    <FormInput
                        control={control}
                        name="carbs"
                        label="Carbohydrates (grams)"
                        placeholder="e.g. 40"
                        keyboardType="numeric"
                        rules={{ required: "Carbs is required" }}
                    />
                    <FormInput
                        control={control}
                        name="fat"
                        label="Fat (grams)"
                        placeholder="e.g. 15"
                        keyboardType="numeric"
                        rules={{ required: "Fat is required" }}
                    />

                </View>

                <View className="mt-10 mb-20">
                    <Button
                        title="Save and Add to Meal"
                        variant="primary"
                        onPress={handleAddCustomFood}
                        textClassName="text-lg font-bold text-white"
                        className="w-full rounded-xl py-4"
                    />
                </View>
            </ScrollView>
        </View>
    );
}