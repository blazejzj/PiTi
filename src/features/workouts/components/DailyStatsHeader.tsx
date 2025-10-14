import { View, Text } from "react-native";

type DailyStatsHeaderProps = {
    date: string; 
    sessionsThisWeek: number;
    averageTimeMinutes: number;
}
export const DailyStatsHeader = ({ date, sessionsThisWeek, averageTimeMinutes }: DailyStatsHeaderProps) => {
    
    const averageTime = `${averageTimeMinutes}min`;

    return (
        <View className="mb-8 items-center pt-8">
            <Text className="text-2xl font-extrabold mb-1 px-5">{date}</Text>           
            <View className="flex-row justify-around w-full max-w-sm mt-4">               
                <View className="items-center">
                    <Text className="text-2xl font-semibold">{sessionsThisWeek}</Text>
                    <Text className="text-sm font-medium text-neutral-500 mt-1">Sessions This Week</Text>
                </View>
                
                <View className="w-px h-12 bg-gray-300 mx-4 self-center" /> 
                
                <View className="items-center">
                    <Text className="text-2xl font-semibold">{averageTime}</Text>
                    <Text className="text-sm font-medium text-neutral-500 mt-1">Avg. Session Time</Text>
                </View>
            </View>
        </View>
    );
};