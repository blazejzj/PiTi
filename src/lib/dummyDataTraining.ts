import { ActiveWorkout, TrainingStats, ExerciseDisplayData } from "../types/training";

export const DUMMY_ACTIVE_WORKOUT: ActiveWorkout = {
    name: "Leg Day", 
    status: "active", 
    duration: "x 32:15",
    exercises: [ 
        { name: "Squats", statusText: "Completed" } as ExerciseDisplayData, 
        { name: "Leg Press", statusText: "Set 2/3" } as ExerciseDisplayData,
        { name: "Deadlift", statusText: "Not Started" } as ExerciseDisplayData,
    ]
};

export const DUMMY_STATS_HEADER: TrainingStats = {
    currentDate: "Monday 1. September",
    sessionsThisWeek: 3,
    averageTimeMinutes: 45,
};

