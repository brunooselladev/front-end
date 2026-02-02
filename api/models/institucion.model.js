const mongoose = require('mongoose');


const actividadEspacioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipoActividad: { type: String, enum: ['principal', 'secundario'], required: true },
  descripcion: { type: String },
  diasHorarios: { type: String },
  formaConfirmacion: { type: String, enum: ['conversacion_previa', 'whatsapp', 'abierta', 'otro'] }
}, { _id: false });

const institucionSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  telefono: { type: String, required: true },
  tipoOrganizacion: { type: String, enum: ['estatal', 'comunitario', 'educacion', 'merendero', 'comedor', 'deportiva', 'religiosa', 'centro vecinal', 'otros'] },
  direccion: { type: String },
  barrio: { type: String },
  encargado: { type: String, required: true },
  poblacionVinculada: [{ type: String, enum: ['niños', 'adolescentes', 'jovenes', 'adultos', 'mayores', 'familias', 'otros'] }],
  diasHorarios: { type: String },
  actividadEspacio: [actividadEspacioSchema],
  coordenadas: {
    lat: { type: Number },
    lng: { type: Number }
  },
  cuentaConInternet: { type: Boolean },
  cuentaConDispositivo: { type: Boolean },
  fechaRegistro: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Institucion = mongoose.model('Institucion', institucionSchema);

module.exports = Institucion;
