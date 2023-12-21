import { Program } from "./program";
import { WorkoutExercise } from "./workout-exercise";

export interface Workout {
    id: number,
    program: Program,
    startedAt: string,
    endedAt: string,
    plannedAt: string;
    status: string;
    user: string,
    workoutExercises: WorkoutExercise[],
    workoutExercisesDone: number,
    toasterShown: any
}
