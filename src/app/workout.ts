import { WorkoutExercise } from "./workout-exercise";

export interface Workout {
    id: number,
    program: string,
    startedAt: string,
    user: string,
    workoutExercises: WorkoutExercise[],
    workoutExercisesDone: number,
    toasterShown: any
}
