const Usuario = require("../models/usuario");

const buscarUsuariosPorCiudad = async (req, res) => {
  try {
    const { ciudad } = req.query;

    if (!ciudad) {
      return res.status(400).json({ error: "Debes proporcionar una ciudad" });
    }

    console.log(`🔍 Buscando usuarios en la ciudad: ${ciudad}`);

    const usuarios = await Usuario.find({
      "direcciones.ciudad": { $regex: new RegExp(`^${ciudad}$`, "i") }
    });

    if (usuarios.length === 0) {
      return res.status(404).json({ error: `No se encontraron usuarios en ${ciudad}` });
    }

    res.json(usuarios);
  } catch (error) {
    console.error("❌ Error en la búsqueda de usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios", detalle: error.message });
  }
};

module.exports = { buscarUsuariosPorCiudad };