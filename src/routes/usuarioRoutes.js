const express = require("express");
const Usuario = require("../models/usuario");
const { buscarUsuariosPorCiudad } = require("../controllers/usuarioController");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { nombre, email, edad, direcciones } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({ error: "Nombre y email son obligatorios" });
    }

    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ error: "El email ya está en uso" });
    }

    const nuevoUsuario = new Usuario({ nombre, email, edad, direcciones });
    await nuevoUsuario.save();

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario", detalle: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const usuarios = await Usuario.find().limit(limit).skip(skip);
    const totalUsuarios = await Usuario.countDocuments();

    res.json({ total: totalUsuarios, pagina: page, usuariosPorPagina: limit, usuarios });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios", detalle: error.message });
  }
});

// 🔍 RUTA PARA BUSCAR USUARIOS POR CIUDAD (MOVERLA ARRIBA)
router.get("/buscar", async (req, res) => {
  try {
    const { ciudad } = req.query;

    if (!ciudad) {
      return res.status(400).json({ error: "Debes proporcionar una ciudad" });
    }

    console.log(`🔍 Buscando usuarios en la ciudad: ${ciudad}`);

    // Buscar usuarios cuya dirección contenga la ciudad especificada
    const usuarios = await Usuario.find({
      "direcciones.ciudad": { $regex: new RegExp(`^${ciudad}$`, "i") }
    });

    if (usuarios.length === 0) {
      return res.status(404).json({ error: `No se encontraron usuarios en ${ciudad}` });
    }

    res.json(usuarios);

  } catch (error) {
    console.error("❌ Error en la búsqueda de usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuario", detalle: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario", detalle: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!usuarioActualizado) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario", detalle: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario", detalle: error.message });
  }
});

module.exports = router;