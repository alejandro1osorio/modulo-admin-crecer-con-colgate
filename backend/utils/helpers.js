export const sanitizeString = (str) => {
  if (!str) return '--'; // Si es null o undefined, usa '--'
  return str
    .toString() // Convierte a string
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Elimina caracteres no imprimibles
    .replace(/[\u2028\u2029]/g, ''); // Elimina caracteres de salto de línea especiales
};
