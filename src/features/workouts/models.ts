export type Program = {
    $id: string;
    userId: string;
    name: string;
    description: string | null;
    $createdAt: string;
    $updatedAt: string;
};

export type ProgramWorkout = {
    $id: string;
    programId: string;
    title: string;
    dayOfWeek: number | null;
    scheduledFor: string | null;
    focusArea?: string | null;
    difficultyLevel: string | null;
    notes: string | null;
    $createdAt: string;
    $updatedAt: string; 

};

export type Workout = {
    $id: string;
    userId: string;
    name: string;
    startedAt: string;
    endedAt: string | null;
    notes: string | null;
    durationMinutes: number | null;
    caloriesBurned: number | null;
    $createdAt: string;
    $updatedAt: string;

};

export type WorkoutExercise = {
    $id: string;
    workoutId: string;
    exerciseName: string;
    $createdAt: string;
    $updatedAt: string;

};

export type WorkoutSet = {
    $id: string;
    workoutExerciseId: string;
    setNumber: number;
    repetitions: number;
    weightKg: number | null;
    $createdAt: string;
    $updatedAt: string;

};
export type ExerciseTemplate = {
    $id: string;
    name: string;
    muscleGroups: string;
    description: string | null;
    equipmentRequired: string | null;
    notes: string | null;
    $createdAt: string;
    $updatedAt: string;       
};

