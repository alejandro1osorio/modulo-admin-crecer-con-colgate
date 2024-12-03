export const sanitizeString = (str) => {
  if (!str) return '--'; // si es null o undefined, usa '--'
  return str
    .toString() // convierte a string
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // elimina caracteres no imprimibles
    .replace(/[\u2028\u2029]/g, ''); // elimina caracteres de salto de línea especiales
};
