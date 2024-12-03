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
    const users = await User.findAllWithTrainings(); // obtener datos
    const filePath = await generateExcelWithExcelJS(users); // eenerar excel con la funcion correcta

    // descargar archivo
    res.download(filePath, 'informe_general.xlsx', (err) => {
      if (err) {
        console.error('Error al enviar el archivo:', err);
        next(err);
      }
    });
  } catch (error) {
    console.error('Error al generar el archivo Excel:', error);
    next(error);
  }
};
