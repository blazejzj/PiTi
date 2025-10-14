import { View, Text } from "react-native";


type WorkoutSessionTagProps = {
    status: 'active' | 'completed' | 'paused' | 'scheduled';
}
export const WorkoutSessionTag = ({ status }: WorkoutSessionTagProps) => {
    
    let text: string;
    let className: string;
    
    switch (status) {
        case 'active':
            text = 'Active';
            className = 'bg-green-500';
            break;
        case 'completed':
            text = 'Completed';
            className = 'bg-blue-500';
            break;
        case 'paused':
            text = 'Paused';
            className = 'bg-gray-400';
            break;
        case 'scheduled':
            text = 'Scheduled';
            className = 'bg-yellow-500';
            break;
        default:
            text = '';
            className = 'bg-gray-200';
    }

    return (
        <View className={`px-3 py-1 rounded-full ${className}`}>
            <Text className="text-xs font-bold text-white uppercase">{text}</Text>
        </View>
    );
};