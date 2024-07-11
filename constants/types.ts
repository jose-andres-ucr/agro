import { CompoundUnit, Unit } from "./units";

export type Field = {
    name: string;
    unit: Unit | CompoundUnit;
    value: number;
}