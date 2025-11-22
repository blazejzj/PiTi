/*import { View, Text, Pressable } from "react-native";

type ActiveWorkoutCardProps = {
    name: string;
    status: 'active' | 'paused' | 'finished'; 
    durationDisplay: string; 
    onTogglePause: () => void;
    isFinished: boolean;
}


export const ActiveWorkoutCard = ({name, status, durationDisplay, onTogglePause, isFinished }: ActiveWorkoutCardProps) => { 	
    
    if (isFinished) {
        return (
            <View className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
                <Text className="text-2xl font-bold text-neutral-800">{name}</Text>
                <Text className="text-base text-gray-500 mt-2">
                    Status: Completed (Total Duration: {durationDisplay})
                </Text>
            </View>
        );
    }
    
    const actionText = status === 'active' ? 'Pause' : 'Resume';
    const actionClass = status === 'active' ? 'bg-orange-500' : 'bg-green-600';
    const statusText = status === 'active' ? 'Active' : 'Paused';

    return (
        <View className="p-5 bg-white border border-gray-200 rounded-xl shadow-md mb-6">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-2xl font-bold text-neutral-800 flex-shrink mr-2">{name}</Text>
                
                <Pressable
                    onPress={onTogglePause}
                    className={`px-4 py-2 rounded-lg shadow-sm ${actionClass}`}
                >
                    <Text className="text-sm font-semibold text-white">{actionText}</Text>
                </Pressable>
            </View>
            
            <View className="flex-row justify-between pt-2 border-t border-gray-100">
                <Text className={`text-sm font-medium ${status === 'active' ? 'text-green-700' : 'text-orange-700'}`}>
                    Status: {statusText}
                </Text>
                <Text className="text-sm font-medium text-neutral-500">
                    Duration: {durationDisplay}
                </Text>
            </View>
        </View>
    );
};*/