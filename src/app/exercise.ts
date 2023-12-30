import { ExerciseType } from "./exercise-type";
import { MuscleGroup } from "./muscle-group";
import { Unit } from "./unit";

export interface Exercise {
    id: number,
    title: string,
    units: Unit[],
    miniature: string,
    description: string,
    difficulty: number,
    muscleGroups: MuscleGroup[],
    type: ExerciseType[]
}
