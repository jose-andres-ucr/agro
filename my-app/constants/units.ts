import { z } from 'zod';

const isNumber = (val: string) => !isNaN(Number(val));
const numberStringSchema = z.string().refine(isNumber);

type NumberString = z.infer<typeof numberStringSchema>;

function isNumberString(val: string): val is NumberString {
  return numberStringSchema.safeParse(val).success;
}

export type Unit = {
    label: string;
    value: string;
}

export type DropdownItem = {
    label: string;
    value: string;
}

export type CompoundUnit = {
    left: Unit;
    right: Unit;
}

export const volumeUnits: Unit[] = [
    { label: 'litros', value: 'L' },
    { label: 'mililitros', value: 'mL' },
  ];

export const distanceUnits: Unit[] = [
    { label: 'kilómetros', value: 'km' },
    { label: 'metros', value: 'm' },
    { label: 'centímetros', value: 'cm' },
    { label: 'milimetros', value: 'mm' },    
  ];

export const areaUnits: Unit[] = [
    { label: 'metros²', value: 'm²' },
    { label: 'centímetros²', value: 'cm²' },
    { label: 'hectáreas', value: 'ha' }
  ];

export const timeUnits: Unit[] = [
    { label: 'segundos', value: 'seg' },
    { label: 'minutos', value: 'min' },
    { label: 'horas', value: 'hrs' }
];

export function convertVolume(value: string | number, from: string, to: string): number {
    if (value === undefined || !isNumberString(value.toString())) {
      return NaN;
    }    
    
    let number = Number(value);
    if (from === undefined || to === undefined || from === to) {
      return number;
    }

    if (from === 'L' && to === 'mL') {
      return number * 1000;
    } else if (from === 'mL' && to === 'L') {
      return number / 1000;
    } else {
      return convertVolume(convertVolume(value, from, 'L'), 'L', to);
    }
  }

export function convertDistance(value: string | number, from: string, to: string): number { 
    if (value === undefined || !isNumberString(value.toString())) {
      return NaN;
    }
    
    let number = Number(value);
    if (from === undefined || to === undefined || from === to) {
      return number;
    }  

    if (from === 'm' && to === 'cm') {
      return number * 100;
    } else if (from === 'cm' && to === 'm') {
      return number / 100;
    } else if (from === 'm' && to === 'mm') {
      return number * 1000;
    } else if (from === 'mm' && to === 'm') {
      return number / 1000;
    } else if (from === 'km' && to === 'm') {
      return number * 1000;
    } else if (from === 'm' && to === 'km') {
      return number / 1000;
    } else {
      return convertDistance(convertDistance(value, from, 'm'), 'm', to);
    }
  }

export function convertArea(value: string | number, from: string, to: string): number {
    if (value === undefined || !isNumberString(value.toString())) {
      return NaN;
    }
    
    let number = Number(value);
    if (from === undefined || to === undefined || from === to) {
      return number;
    }
        
    if (from === 'm²' && to === 'cm²') {
      return number * 10000;
    } else if (from === 'cm²' && to === 'm²') {
      return number / 10000;
    } else if (from === 'ha' && to === 'm²') {
      return number * 10000;
    } else if (from === 'm²' && to === 'ha') {
      return number / 10000;
    } else {
      return convertArea(convertArea(value, from, 'm²'), 'm²', to);
    }
  }

export function convertTime(value: string | number, from: string, to: string): number {
    if (value === undefined || !isNumberString(value.toString())) {
      return NaN;
    }

    let number = Number(value);    
    if (from === undefined || to === undefined || from === to) {
      return number;
    }

    if (from === 'seg' && to === 'min') {
      return number / 60;
    } else if (from === 'min' && to === 'seg') {
      return number * 60;
    } else if (from === 'min' && to === 'hrs') {
      return number / 60;
    } else if (from === 'hrs' && to === 'min') {
      return number * 60;
    } else {
      return convertTime(convertTime(value, from, 'min'), 'min', to);
    }
  }