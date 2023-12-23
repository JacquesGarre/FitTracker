import { Exercise } from "./exercise";

export interface Program {
    id: Number,
    title: string,
    user: string,
    exercises: Exercise[]
    programExercises: any[]
}
