import { Mensaje } from '../../models/mensaje.model';

// MOCK_MENSAJES: Array de mensajes simulados
// Los mensajes tienen idEmisor que corresponde a integrantes del chat
export const MOCK_MENSAJES: Mensaje[] = [
  // Chat 1 (USMYA 17 - Agustina Herrera)
  {
    id: 1,
    descripcion: "Hola equipo, Hector vino ayer al comedor comunitario. Parecía un poco ansioso.",
    idEmisor: 5, // Pedro Ramirez (agente)
    idChat: 1,
    fecha: "2025-11-01",
    hora: "09:30"
  },
  {
    id: 2,
    descripcion: "Buenos días Pedro. ¿Cómo evaluaste su estado anímico? ¿Necesita alguna derivación?",
    idEmisor: 9, // Dr. Juan Perez (efector)
    idChat: 1,
    fecha: "2025-11-01",
    hora: "09:35"
  },
  {
    id: 3,
    descripcion: "Estoy de acuerdo con la evaluación. Hector necesita apoyo emocional. Podemos coordinar una sesión con el psicólogo.",
    idEmisor: 13, // Marcela Suarez (referente)
    idChat: 1,
    fecha: "2025-11-01",
    hora: "09:40"
  },
  {
    id: 4,
    descripcion: "Perfecto. Yo me encargo de agendar la cita. También evaluemos si necesita apoyo académico adicional.",
    idEmisor: 5, // Pedro Ramirez (agente)
    idChat: 1,
    fecha: "2025-11-01",
    hora: "09:45"
  },

  // Chat 2 (USMYA 18 - Mateo Fernandez)
  {
    id: 5,
    descripcion: "Hola equipo, Agustina tuvo una consulta médica esta mañana en el centro de salud.",
    idEmisor: 6, // Sofia Mendez (agente)
    idChat: 2,
    fecha: "2025-11-02",
    hora: "14:20"
  },
  {
    id: 6,
    descripcion: "Excelente que haya ido al médico. ¿Qué diagnóstico le dieron? ¿Necesita seguimiento psicológico?",
    idEmisor: 10, // Dra. Laura Garcia (efector)
    idChat: 2,
    fecha: "2025-11-02",
    hora: "14:25"
  },
  {
    id: 7,
    descripcion: "Le recomendaron hacer más ejercicio y descansar mejor. Creo que podríamos derivarlo a terapia ocupacional.",
    idEmisor: 14, // Diego Morales (referente)
    idChat: 2,
    fecha: "2025-11-02",
    hora: "14:30"
  },
  {
    id: 8,
    descripcion: "De acuerdo. Yo me encargo de coordinar la cita. Agustina parece motivada para mejorar.",
    idEmisor: 6, // Sofia Mendez (agente)
    idChat: 2,
    fecha: "2025-11-02",
    hora: "14:35"
  },

  // Chat 3 (USMYA 19 - Camila Romero)
  {
    id: 9,
    descripcion: "Buenas tardes equipo. Camila vino hoy al taller de arte. Está muy participativa.",
    idEmisor: 8, // Carmen Torres (agente)
    idChat: 3,
    fecha: "2025-11-03",
    hora: "16:10"
  },
  {
    id: 10,
    descripcion: "Hola Carmen, ¿ha podido hacer las actividades que le recomendé la semana pasada?",
    idEmisor: 12, // Dra. Valentina Rodriguez (efector)
    idChat: 3,
    fecha: "2025-11-03",
    hora: "16:15"
  },
  {
    id: 11,
    descripcion: "Sí, ha estado muy constante. Creo que está lista para el próximo nivel del programa.",
    idEmisor: 16, // Fernando Castro (referente)
    idChat: 3,
    fecha: "2025-11-03",
    hora: "16:20"
  },
  {
    id: 12,
    descripcion: "Excelente progreso. Sigamos apoyándola. Recuerda que estamos aquí para lo que necesite.",
    idEmisor: 8, // Carmen Torres (agente)
    idChat: 3,
    fecha: "2025-11-03",
    hora: "16:25"
  },
  {
    id: 13,
    descripcion: "Sí, ha estado muy constante. Creo que está lista para el próximo nivel del programa.",
    idEmisor: 11, // Carmen Torres (agente)
    idChat: 4,
    fecha: "2025-11-03",
    hora: "16:25"
  },
  {
    id: 14,
    descripcion: "Buenas tardes equipo. Camila vino hoy al taller de arte. Está muy participativa.",
    idEmisor: 10, // Carmen Torres (agente)
    idChat: 4,
    fecha: "2025-11-03",
    hora: "16:25"
  },
  {
    id: 15,
    descripcion: "Excelente progreso. Sigamos apoyándola. Recuerda que estamos aquí para lo que necesite.",
    idEmisor: 9, // Carmen Torres (agente)
    idChat: 4,
    fecha: "2025-11-03",
    hora: "16:25"
  },
  {
    id: 16,
    descripcion: "De acuerdo. Yo me encargo de coordinar la cita. Mateo parece motivado para mejorar.",
    idEmisor: 10, // Carmen Torres (agente)
    idChat: 4,
    fecha: "2025-11-03",
    hora: "16:25"
  }
];