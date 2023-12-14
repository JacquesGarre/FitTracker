import { Exercise } from "./exercise";
import { Record } from "./record";
import { Set } from "./set";

export interface WorkoutExercise {
    id: number,
    exercise: Exercise,
    records: Record[],
    sets: Set[],
    setsDone: number,
    toasterShown: any
}
