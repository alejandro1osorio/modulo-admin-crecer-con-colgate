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
    const users = await User.findAllWithTrainings();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No hay datos para exportar' });
    }

    console.log("✅ Usuarios obtenidos para Excel:", users);

    const buffer = await generateExcelWithExcelJS(users);

    res.setHeader('Content-Disposition', 'attachment; filename="informe_general.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send(Buffer.from(buffer));
    console.log("✅ Archivo Excel enviado correctamente");
  } catch (error) {
    console.error('❌ Error al generar el archivo Excel:', error);
    next(error);
  }
};


