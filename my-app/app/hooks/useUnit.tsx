import { useCallback, useState } from "react";

export default function useUnit(startingUnit: string, startingValue: number, convertionFunction: (value: number, from: string, to: string) => number) {
    const [unit, setUnit] = useState(startingUnit);
    const [value, setValue] = useState(startingValue);

    const handleUnitChange = useCallback((newUnit: string, value: number) => {        
        if (newUnit !== unit) {            
            let converted = convertionFunction(value, unit, newUnit);    
            if (!isNaN(Number(converted))) {   
                setValue(converted);
            }         
            setUnit(newUnit);
        }
    }, [unit, value]);

    return { value, unit, handleUnitChange };
}   