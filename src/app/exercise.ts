import { Unit } from "./unit";

export interface Exercise {
    id: Number,
    title: string,
    units: Unit[],
    miniature: string,
    description: string
}
