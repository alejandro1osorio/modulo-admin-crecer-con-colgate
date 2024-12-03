import db from './db.js';

const User = {
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        usuarios.id,
        usuarios.correo,
        distribuidores.nombre AS distribuidor,
        usuarios.occ,
        regiones.nombre AS region,
        zonas.nombre AS zona,
        puntos_de_venta.nombre AS punto_venta,
        usuarios.celular,
        usuarios.fecha_registro
      FROM usuarios
      LEFT JOIN distribuidores ON usuarios.Distribuidores_id = distribuidores.id
      LEFT JOIN regiones ON usuarios.Regiones_id = regiones.id
      LEFT JOIN zonas ON usuarios.Zonas_id = zonas.id
      LEFT JOIN puntos_de_venta ON usuarios.Puntos_de_Venta_id = puntos_de_venta.id
    `);
    return rows;
  },
  findAllWithTrainings: async () => {
    const [rows] = await db.query(`
      SELECT 
        usuarios.id,
        usuarios.correo,
        distribuidores.nombre AS distribuidor,
        usuarios.occ,
        regiones.nombre AS region,
        zonas.nombre AS zona,
        puntos_de_venta.nombre AS punto_venta,
        usuarios.celular,
        usuarios.codigo_pdv,
        usuarios.fecha_registro,
        visualizaciones.estados AS estado,
        capacitaciones.nombre AS capacitacion
      FROM usuarios
      LEFT JOIN distribuidores ON usuarios.Distribuidores_id = distribuidores.id
      LEFT JOIN regiones ON usuarios.Regiones_id = regiones.id
      LEFT JOIN zonas ON usuarios.Zonas_id = zonas.id
      LEFT JOIN puntos_de_venta ON usuarios.Puntos_de_Venta_id = puntos_de_venta.id
      LEFT JOIN visualizaciones ON usuarios.id = visualizaciones.Usuarios_id
      LEFT JOIN capacitaciones ON FIND_IN_SET(capacitaciones.id, visualizaciones.estados)
    `);
    return rows;
  },
};

export default User;
