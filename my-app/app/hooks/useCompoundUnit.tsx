import { useCallback, useState } from "react";

export default function useCompoundUnit(startingLeftUnit: string, startingRightUnit: string, startingValue: number, lefConvertionFunction: (value: number, from: string, to: string) => number, rightConvertionFunction: (value: number, from: string, to: string) => number) {
    const [leftUnit, setLeftUnit] = useState(startingLeftUnit);
    const [rightUnit, setRightUnit] = useState(startingRightUnit);
    const [value, setValue] = useState(startingValue);

    const handleLeftUnitChange = useCallback((newUnit: string, value: number) => {             
        if (newUnit && newUnit !== leftUnit) {            
            let converted = lefConvertionFunction(value, leftUnit, newUnit);            
            if (!isNaN(Number(converted))) {
                setValue(converted);
            }
            setLeftUnit(newUnit);
        }

    }, [leftUnit]);

    const handleRightUnitChange = useCallback((newUnit: string, value: number) => {            
        if (newUnit && newUnit !== rightUnit) {
            let factor = rightConvertionFunction(1, rightUnit, newUnit);
            if (factor > 0) {
                factor = 1 / factor;
            }
            let converted = value * factor;
            if (!isNaN(Number(converted))) {
                setValue(converted);
            }
            setRightUnit(newUnit);
        }

    }, [rightUnit]);

    return { value, leftUnit, rightUnit, handleLeftUnitChange, handleRightUnitChange };
}   