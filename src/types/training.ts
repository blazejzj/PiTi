
export interface ExerciseDisplayData {
    name: string;
    statusText: string; 
}

export interface TrainingStats {
    sessionsThisWeek: number;
    averageTimeMinutes: number;
    currentDate: string;
}

export interface ActiveWorkout {
    name: string;
    status: 'active' | 'paused' | 'completed' | 'scheduled';
    duration: string;
    exercises: ExerciseDisplayData[];
}