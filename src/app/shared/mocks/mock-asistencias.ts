import { Asistencia } from '../../models/asistencia.model';

// MOCK_ASISTENCIAS: Array de asistencias simuladas siguiendo la estructura del modelo Asistencia
export const MOCK_ASISTENCIAS: Asistencia[] = [
  {
    id: 1,
    idActividad: 1, // Taller de Arte para Niños
    idUser: 17, // Agustina Herrera (USMYA)
    estado: 'presente',
    observacion: 'Participó activamente en todas las actividades del taller'
  },
  {
    id: 2,
    idActividad: 1, // Taller de Arte para Niños
    idUser: 18, // Otro USMYA
    estado: 'ausente',
    observacion: 'No pudo asistir por motivos familiares'
  },
  {
    id: 3,
    idActividad: 2, // Reunión Vecinal
    idUser: 17, // Agustina Herrera (USMYA)
    estado: 'presente',
    observacion: 'Contribuyó con ideas para nuevas actividades comunitarias'
  },
  {
    id: 4,
    idActividad: 3, // Merienda Saludable
    idUser: 19, // Otro USMYA
    estado: 'presente',
    observacion: 'Disfrutó mucho la merienda y las actividades recreativas'
  },
  {
    id: 5,
    idActividad: 11, // Clase de Música
    idUser: 17, // Agustina Herrera (USMYA)
    estado: 'ausente',
    observacion: 'Se sintió enferma y no pudo participar'
  },
  {
    id: 6,
    idActividad: 11, // Clase de Música
    idUser: 20, // Otro USMYA
    estado: 'presente',
    observacion: 'Mostró gran interés por los instrumentos musicales'
  },
  {
    id: 7,
    idActividad: 2, // Reunión Vecinal
    idUser: 18, // USMYA
    estado: 'presente',
    observacion: 'Ayudó en la organización del encuentro'
  },
  {
    id: 8,
    idActividad: 3, // Merienda Saludable
    idUser: 17, // Agustina Herrera (USMYA)
    estado: 'presente',
    observacion: 'Compartió la merienda con otros participantes'
  },
  {
    id: 9,
    idActividad: 2, // Reunión Vecinal
    idUser: 21, // Nuevo USMYA
    estado: 'presente',
    observacion: 'Propuso nuevas ideas para el barrio'
  },
  {
    id: 10,
    idActividad: 8, // Torneo de Ajedrez
    idUser: 17, // Agustina Herrera (USMYA)
    estado: 'presente',
    observacion: 'Participó en varias rondas del torneo'
  },
  {
    id: 11,
    idActividad: 8, // Torneo de Ajedrez
    idUser: 18, // USMYA
    estado: 'presente',
    observacion: 'Llegó a semifinales del torneo'
  },
  {
    id: 12,
    idActividad: 8, // Torneo de Ajedrez
    idUser: 22, // Nuevo USMYA
    estado: 'ausente',
    observacion: 'No pudo asistir por enfermedad'
  },
  {
    id: 13,
    idActividad: 12, // Taller de Cocina Saludable
    idUser: 17, // Agustina Herrera (USMYA)
    estado: 'presente',
    observacion: 'Aprendió a preparar ensaladas nutritivas'
  },
  {
    id: 14,
    idActividad: 12, // Taller de Cocina Saludable
    idUser: 21, // USMYA
    estado: 'presente',
    observacion: 'Compartió recetas familiares tradicionales'
  },
  {
    id: 15,
    idActividad: 12, // Taller de Cocina Saludable
    idUser: 23, // Nuevo USMYA
    estado: 'presente',
    observacion: 'Disfrutó aprendiendo nuevas técnicas culinarias'
  },
  {
    id: 16,
    idActividad: 13, // Clase de Danza Folklórica
    idUser: 17, // Agustina Herrera (USMYA)
    estado: 'presente',
    observacion: 'Mostró gran entusiasmo por las danzas tradicionales'
  },
  {
    id: 17,
    idActividad: 13, // Clase de Danza Folklórica
    idUser: 18, // USMYA
    estado: 'presente',
    observacion: 'Aprendió los pasos básicos del chamamé'
  },
  {
    id: 18,
    idActividad: 13, // Clase de Danza Folklórica
    idUser: 24, // Nuevo USMYA
    estado: 'ausente',
    observacion: 'Tuvo que ausentarse por compromiso familiar'
  }
];