import { NotaTrayectoria } from '../../models/nota-trayectoria.model';

// MOCK_NOTAS_TRAYECTORIA: Array de notas de trayectoria simuladas
export const MOCK_NOTAS_TRAYECTORIA: NotaTrayectoria[] = [
  {
    id: 1,
    idActor: 9, // Dr. Juan Perez (efector)
    idUsmya: 17, // Agustina Morales
    titulo: "Primera evaluación psicológica",
    observacion: "Paciente muestra signos de ansiedad moderada. Ha expresado preocupación por su futuro laboral y educativo. Recomiendo seguimiento semanal y técnicas de relajación.",
    fecha: "2025-10-15T00:00:00.000Z",
    hora: "10:30"
  },
  {
    id: 2,
    idActor: 13, // Diego Morales (referente afectivo)
    idUsmya: 17, // Agustina Morales
    titulo: "Apoyo emocional - Sesión de acompañamiento",
    observacion: "La paciente ha mostrado progreso en la identificación de sus emociones. Está trabajando en establecer rutinas diarias. Mantiene buena comunicación con su referente afectivo.",
    fecha: "2025-10-18T00:00:00.000Z",
    hora: "14:15"
  },
  {
    id: 3,
    idActor: 10, // Dra. Laura Garcia (efector - psicóloga)
    idUsmya: 17, // Agustina Morales
    titulo: "Seguimiento terapéutico",
    observacion: "Sesión productiva. La paciente ha implementado las técnicas de mindfulness sugeridas. Reporta reducción en síntomas de ansiedad. Continuar con el plan establecido.",
    fecha: "2025-10-22T00:00:00.000Z",
    hora: "11:00"
  },
  {
    id: 4,
    idActor: 14, // Diego Morales (referente afectivo)
    idUsmya: 17, // Agustina Morales
    titulo: "Revisión de objetivos semanales",
    observacion: "Cumplimiento satisfactorio de objetivos establecidos. Ha asistido a 3 actividades grupales esta semana. Muestra mayor confianza en interacciones sociales.",
    fecha: "2025-10-25T00:00:00.000Z",
    hora: "16:45"
  },
  {
    id: 5,
    idActor: 11, // Lic. Miguel Lopez (efector)
    idUsmya: 17, // Agustina Morales
    titulo: "Evaluación de progreso académico",
    observacion: "Ha mejorado su rendimiento en matemáticas. Sigue teniendo dificultades con concentración, pero está motivada para continuar. Sugiero técnicas de estudio específicas.",
    fecha: "2025-10-28T00:00:00.000Z",
    hora: "09:30"
  },
  {
    id: 6,
    idActor: 15, // Patricia Vega (referente afectivo)
    idUsmya: 17, // Agustina Morales
    titulo: "Sesión de refuerzo emocional",
    observacion: "Paciente expresó sentimientos de frustración por situaciones familiares. Trabajamos en estrategias de comunicación asertiva. Recomiendo continuar el apoyo semanal.",
    fecha: "2025-10-30T00:00:00.000Z",
    hora: "13:20"
  }
];