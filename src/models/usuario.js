const mongoose = require("mongoose");

const direccionSchema = new mongoose.Schema({
  calle: { type: String, required: true },
  ciudad: { type: String, required: true },
  pais: { type: String, required: true },
  codigo_postal: { type: String, required: true },
});

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: [true, "El nombre es obligatorio"] },
  email: { 
    type: String, 
    required: [true, "El email es obligatorio"], 
    unique: [true, "El email ya está registrado"], 
    match: [/.+@.+\..+/, "El email no es válido"] 
  },
  edad: { type: Number, min: [0, "La edad no puede ser negativa"] },
  fecha_creacion: { type: Date, default: Date.now },
  direcciones: { 
    type: [direccionSchema],
    validate: {
      validator: function (v) { return v.length > 0; },
      message: "Debe proporcionar al menos una dirección válida"
    }
  },
});

module.exports = mongoose.model("Usuario", usuarioSchema);
