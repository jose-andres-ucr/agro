import { z } from "zod";

export const positiveNumber = z
  .coerce
  .number({ invalid_type_error: 'Debe ser un valor numérico' })
  .refine((val) => val > 0, { message: 'Debe ser un número positivo' });