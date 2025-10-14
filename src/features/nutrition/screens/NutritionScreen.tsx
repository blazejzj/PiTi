import { useRouter } from "expo-router";
import { useState, useMemo } from 'react';
import { View, Text, FlatList, Pressable, ScrollView, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../components/Button'; 
import { DummyMeals } from '../../../lib/dummyDataMeal';
import MealItem from '../components/MealItem';
import { Meal } from '../../../types/nutrition';


export default function NutritionScreen() {
    const router = useRouter();
    
    const [meals, setMeals] = useState<Meal[]>(DummyMeals);
    
    const totalKcal = useMemo(() => {
        return meals.reduce((sum, meal) => sum + meal.totalKcal, 0);
    }, [meals]);

    const kcalGoal = 2500;
    const currentKcal = totalKcal;
        
    // static macro calculations - todo: make dynamic, hooks?
    const totalCarbs = useMemo(() => meals.reduce((sum, m) => sum + m.carbs, 0), [meals]);
    const totalProtein = useMemo(() => meals.reduce((sum, m) => sum + m.protein, 0), [meals]);
    const totalFat = useMemo(() => meals.reduce((sum, m) => sum + m.fat, 0), [meals]);

    const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const selectedDay = 'Mon';

    const handleAddMeal = () => {
        router.push('/food/addMeal'); 
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <FlatList 
                data={meals} 
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MealItem meal={item} />}
                showsVerticalScrollIndicator={false}
                
                //header - "everything before meals" - stats
                ListHeaderComponent={() => (
                    <View>
                        
                        <View className="px-5 pt-3 mb-6 items-center">
                            <Text className="text-xl font-bold mb-1">Monday 1. September</Text>
                            <Text className="text-xl mb-3">{currentKcal}/{kcalGoal} kcal</Text>
                            <View className="h-2 bg-gray-200 rounded-full w-full">
                                <View 
                                    className="h-2 bg-green-500 rounded-full" 
                                    style={{ width: `${Math.min(100, (currentKcal / kcalGoal) * 100)}%` }} 
                                />
                            </View>
                        </View>
                        <View className="flex-row justify-between px-8 mb-8">
                            <MacroDisplay label="Carbs" value={`${totalCarbs}g`} />
                            <MacroDisplay label="Protein" value={`${totalProtein}g`} />
                            <MacroDisplay label="Fat" value={`${totalFat}g`} />
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 px-5">
                            {WEEKDAYS.map(day => (
                                <Pressable 
                                    key={day} 
                                    className={`px-4 py-2 rounded-xl mr-2 ${day === selectedDay ? 'bg-green-500' : 'bg-gray-100'}`}
                                >
                                    <Text className={day === selectedDay ? 'text-white font-bold' : 'text-gray-700 font-semibold'}>
                                        {day}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                )}
                ItemSeparatorComponent={() => <View className="h-4" />}

            

                // footer - "everything after meals"  - button to add meal
                ListFooterComponent={() => (
                    <View className="px-5 py-5">
                        <Button
                            title="+ Add meal"
                            variant="primary" 
                            onPress={handleAddMeal}
                            className="w-full rounded-xl" 
                            textClassName="text-lg font-bold text-white" 
                        />
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
// macro display helper
const MacroDisplay = ({ label, value }: { label: string, value: string }) => (
    <View className="items-center">
        <Text className="text-base">{value}</Text> 
        <Text className="text-xs text-neutral-500">{label}</Text>
    </View>
);
