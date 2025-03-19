import User from '../models/userModel.js';
import { generateExcelWithExcelJS } from '../utils/excelExport.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const downloadExcel = async (req, res, next) => {
  try {
    const users = await User.findAllWithTrainings(); // Obtener datos
    const buffer = await generateExcelWithExcelJS(users); // Generar Excel como buffer

    // Configurar encabezados para la descarga
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="informe_general.xlsx"');

    // Enviar el buffer al cliente
    res.send(buffer);
  } catch (error) {
    console.error('Error al generar el archivo Excel:', error);
    next(error);
  }
};

