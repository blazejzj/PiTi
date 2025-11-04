import { create } from "zustand";

const generateDraftId = () => Math.random().toString(36).substring(2, 9);

// details for a single set
export type PlannedSetEntry = {
    setNumber: number; 
    repetitions: number;
    weightKg: number;
};

// container for one exercise (holds multiple sets)
export type WorkoutDraftExercise = {
    id: string;
    exerciseName: string;
    sets: PlannedSetEntry[]; 

};

// actions
type WorkoutDraftState = {
    workoutName: string;
    draftedExercises: WorkoutDraftExercise[];
    
    setWorkoutName: (name: string) => void;
    // adds a new exercise structure to the draft.
    addExercise: (exercise: Omit<WorkoutDraftExercise, 'id'>) => void;
    // removes an exercise by its unique draft ID.
    removeExercise: (id: string) => void; 
    // clears the entire draft after a successful save.
    clearDraft: () => void; 
    //provides a summary of the workout draft - weight lifted in total for motivation purposes
    summary: () => {
        totalVolumeKg: number; 
    };
};

export const useWorkoutDraft = create<WorkoutDraftState>((set, get) => ({
    workoutName: "New Session",
    draftedExercises: [],

    setWorkoutName: (name: string) => set({ workoutName: name }),

    addExercise: (exercise: Omit<WorkoutDraftExercise, 'id'>) => 
        set((state) => ({
            draftedExercises: [...state.draftedExercises, { ...exercise, id: generateDraftId() }],
        })),
    
    removeExercise: (id: string) =>
        set((state) => ({
            draftedExercises: state.draftedExercises.filter((e) => e.id !== id),
        })),
        
    clearDraft: () => set({ workoutName: "New Session", draftedExercises: [] }),

    summary: () => {
        const totalVolumeKg = get().draftedExercises.reduce(
            (acc, exercise) => 
                acc + exercise.sets.reduce(
                    (setAcc, set) => setAcc + (set.repetitions * set.weightKg), 
                    0
                ),
            0
        );
        return { totalVolumeKg: Math.round(totalVolumeKg) };
    },
}));
