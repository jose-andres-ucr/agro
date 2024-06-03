export type Unit = {
    label: string;
    value: string;
}

export const volumeUnits: Unit[] = [
    { label: 'litros', value: 'L' },
    { label: 'mililitros', value: 'mL' },
  ];

export const distanceUnits: Unit[] = [
    { label: 'metros', value: 'm' },
    { label: 'centímetros', value: 'cm' },
  ];