import ExcelJS from 'exceljs'; 
import { sanitizeString } from './helpers.js';

export const generateExcelWithExcelJS = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Informe General');

  // agregar titulo personalizado capacitaciones ↓
  const customCapacitacionTitles = {
    1: "Colgate Total Charcoal",
    2: "Colgate Línea Gard",
    3: "Colgate Plax Odor Control",
    4: "Colgate Sensitive Pro Relief",
    5: "Speed Stick y Lady Speed Stick Clinical Complete",
    6: "Lady Speed Stick Hair Minimizer",
    7: "Cepillo Colgate Sensitive",
    8: "Colgate Sensitive Pro Alivio Xtreme Temperatures",
    9: "Colgate Total 12",
    10: "Cepillo Colgate Zig Zag Charcoal",
    11: "Cepillo Colgate Slim Soft",
    12: "Colgate Total",
    13: "Colgate Total Prevención Activa",
  }; 

  const capacitacionesMap = {};
  data.forEach((row) => {
    if (row.estado) {
      const estados = JSON.parse(row.estado);
      Object.keys(estados).forEach((id) => {
        if (!capacitacionesMap[id]) {
          //capacitacionesMap[id] = row.capacitacion || `Capacitación ${id}`;
          capacitacionesMap[id] = customCapacitacionTitles[id] || row.capacitacion || `Capacitación ${id}`;
        }
      });
    }
  });

  const capacitacionesNombres = Object.values(capacitacionesMap);


  // funcion para formatear fechas
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    } catch {
      return '--'; // Fallback si la fecha no es valida
    }
  };


  const cleanedData = data.map((row, rowIndex) => {
    const estados = JSON.parse(row.estado || '{}');
    const estadosPorCapacitacion = Object.keys(capacitacionesMap).reduce((acc, id) => {
      const nombreCapacitacion = capacitacionesMap[id] || `Capacitación ${id}`;
      acc[nombreCapacitacion] = estados[id] === 'Visto' ? 'Visto' : 'No';
      return acc;
    }, {});

    return {
      //ID: sanitizeString(row.id) || '--',
      //ID: index + 1,
      ID: rowIndex + 1,
      'Correo Electrónico': sanitizeString(row.correo) || '--',
      Distribuidor: sanitizeString(row.distribuidor) || '--',
      //Occ: sanitizeString(row.occ) || '--',
      Occ: sanitizeString(row.occ) === '1' ? 'SI' : sanitizeString(row.occ) || '--',
      Región: sanitizeString(row.region) || '--',
      Zonas: sanitizeString(row.zona) || '--',
      'Puntos de Venta': sanitizeString(row.punto_venta) || '--',
      Celular: sanitizeString(row.celular) || '--',
      'Código PDV': sanitizeString(row.codigo_pdv) || '--',
      //'Fecha de Registro': sanitizeString(row.fecha_registro) || '--',
      'Fecha de Registro': formatDate(row.fecha_registro),
      ...estadosPorCapacitacion,
    };
  });

  // agregar encabezados
  worksheet.mergeCells('A1:J1');
  const headerGeneral = worksheet.getCell('A1');
  headerGeneral.value = 'Datos Generales';
  headerGeneral.alignment = { horizontal: 'center', vertical: 'middle' };
  headerGeneral.font = { bold: true };
  headerGeneral.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'CCFFCC' }, 
  };

  const capacitacionesStart = 11;
  const capacitacionesEnd = capacitacionesStart + capacitacionesNombres.length - 1;
  worksheet.mergeCells(1, capacitacionesStart, 1, capacitacionesEnd);
  const headerVisualizacion = worksheet.getCell(1, capacitacionesStart);
  headerVisualizacion.value = 'Visualización de Videos';
  headerVisualizacion.alignment = { horizontal: 'center', vertical: 'middle' };
  headerVisualizacion.font = { bold: true };
  headerVisualizacion.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD700' }, 
  };

  const headerRow = worksheet.addRow([
    'ID',
    'Correo Electrónico',
    'Distribuidor',
    'Occ',
    'Región',
    'Zonas',
    'Puntos de Venta',
    'Celular',
    'Código PDV',
    'Fecha de Registro',
    ...capacitacionesNombres,
  ]);

  // estilo para la fila de encabezados
  headerRow.eachCell((cell, colNumber) => {
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.font = { bold: true };
    if (colNumber >= 11) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ADD8E6' }, 
      };
    } else {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCCC' }, 
      };
    }
  });

  // bordes fila 1 - 2 (A - U)
  for (let rowIndex = 1; rowIndex <= 2; rowIndex++) {
    const row = worksheet.getRow(rowIndex);
    for (let colIndex = 1; colIndex <= 21; colIndex++) { // 21 = columna U
      const cell = row.getCell(colIndex);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
  }

  // agregar datos
  cleanedData.forEach((item, rowIndex) => {
    const row = worksheet.addRow(Object.values(item));
    row.eachCell((cell, colNumber) => {
      if (colNumber >= 11 && cell.value === 'Visto') {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '006400' }, 
        };
        cell.font = { color: { argb: 'FFFFFF' } }; 
      }
    });
  });

  // ajustar ancho de columnas
  worksheet.columns = [
    { width: 10 }, // id
    { width: 38 }, // email
    { width: 20 }, // distribuidor
    { width: 10 }, // occ
    { width: 20 }, // region
    { width: 36 }, // zonas
    { width: 43 }, // puntos de venta
    { width: 15 }, // celular
    { width: 14 }, // codigo pdv
    { width: 25 }, // fecha registro
    // ...capacitacionesNombres.map(() => ({ width: 45 })),
    { width: 21 }, // training 1
    { width: 18 }, // training 2
    { width: 24 }, // training 3
    { width: 25 }, // training 4
    { width: 45 }, // training 5
    { width: 28 }, // training 6
    { width: 22 }, // training 7
    { width: 43 }, // training 8
    { width: 16 }, // training 9
    { width: 28 }, // training 10
    { width: 21 }, // training 11
    { width: 21 }, // training 12
    { width: 30 }, // training 13
  ];

  // ajustar altura de filas
  worksheet.getRow(1).height = 40; // Fila 1 (Datos Generales y Visualización)
  worksheet.getRow(2).height = 90; // Fila 2 (Encabezados)

  // guardar el archivo
  const filePath = 'informe_general_exceljs.xlsx';
  await workbook.xlsx.writeFile(filePath);
  console.log('Archivo generado correctamente con exceljs:', filePath);

  return filePath;
};