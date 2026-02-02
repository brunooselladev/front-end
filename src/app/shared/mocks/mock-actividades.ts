import { Actividad } from '../../models/actividad.model';

// MOCK_ACTIVIDADES: Array de actividades simuladas siguiendo la estructura del modelo Actividad
export const MOCK_ACTIVIDADES: Actividad[] = [
  {
    id: 1,
    nombre: "Taller de Arte para Niños",
    descripcion: "Taller creativo donde los niños aprenden técnicas básicas de pintura y dibujo con materiales reciclados",
    dia: new Date('2025-10-29'),
    hora: "14:00",
    horaFin: "16:00",
    responsable: "María González",
    espacioId: 1, // Centro Comunitario Norte
    lugar: "Sala de Talleres",
    esFija: true,
    isVerified: true
  },
  {
    id: 11,
    nombre: "Clase de Música",
    descripcion: "Introducción a instrumentos musicales básicos para niños de 6 a 10 años",
    dia: new Date('2025-10-28'),
    hora: "14:00",
    horaFin: "15:30",
    responsable: "Carlos Música",
    espacioId: 5, // Centro Educativo San Jorge
    lugar: "Sala de Música",
    esFija: true,
    isVerified: true
  },
  {
    id: 2,
    nombre: "Reunión Vecinal",
    descripcion: "Encuentro mensual para discutir temas comunitarios y planificar actividades del barrio",
    dia: new Date('2025-10-27'),
    hora: "18:30",
    horaFin: "20:30",
    responsable: "Carlos Rodríguez",
    espacioId: 2, // Barrio Las Flores
    lugar: "Salón Principal",
    esFija: true,
    isVerified: true
  },
  {
    id: 3,
    nombre: "Merienda Saludable",
    descripcion: "Distribución de merienda nutritiva para niños del barrio con actividades recreativas",
    dia: new Date('2025-10-30'),
    hora: "16:00",
    horaFin: "17:00",
    responsable: "Ana Martínez",
    espacioId: 3, // Villa Libertad
    lugar: "Patio Central",
    esFija: true,
    isVerified: true
  },
  {
    id: 4,
    nombre: "Entrenamiento de Fútbol Infantil",
    descripcion: "Clases de fútbol para niños de 8 a 12 años con énfasis en valores y trabajo en equipo",
    dia: new Date('2025-10-30'),
    hora: "17:00",
    horaFin: "19:00",
    responsable: "Pedro Sánchez",
    espacioId: 4, // Complejo Los Pumitas
    lugar: "Cancha de Fútbol",
    esFija: true,
    isVerified: true
  },
  {
    id: 5,
    nombre: "Apoyo Escolar",
    descripcion: "Clases de apoyo para estudiantes de primaria con dificultades en matemáticas y lengua",
    dia: new Date('2025-10-31'),
    hora: "15:30",
    horaFin: "17:30",
    responsable: "Lic. Laura Fernández",
    espacioId: 5, // Centro Educativo San Jorge
    lugar: "Aula 2",
    esFija: true,
    isVerified: true
  },
  {
    id: 6,
    nombre: "Charla de Salud Mental",
    descripcion: "Conferencia sobre importancia de la salud mental en la comunidad, con profesionales invitados",
    dia: new Date('2025-10-31'),
    hora: "19:00",
    horaFin: "21:00",
    responsable: "Dr. Juan Pérez",
    espacioId: 6, // Hospital Central
    lugar: "Auditorio Principal",
    esFija: false,
    isVerified: false
  },
  {
    id: 7,
    nombre: "Taller de Huerta Comunitaria",
    descripcion: "Aprendizaje de técnicas de cultivo urbano y mantenimiento de huertas orgánicas",
    dia: new Date('2025-10-19'),
    hora: "10:00",
    horaFin: "12:00",
    responsable: "Roberto Silva",
    espacioId: 1, // Centro Comunitario Norte
    lugar: "Jardín Trasero",
    esFija: true,
    isVerified: true
  },
  {
    id: 8,
    nombre: "Torneo de Ajedrez",
    descripcion: "Competencia amistosa de ajedrez para jóvenes del barrio con premios simbólicos",
    dia: new Date('2025-11-01'),
    hora: "10:00",
    horaFin: "12:00",
    responsable: "Miguel López",
    espacioId: 2, // Barrio Las Flores
    lugar: "Sala de Reuniones",
    esFija: false,
    isVerified: false
  },
  {
    id: 12,
    nombre: "Taller de Cocina Saludable",
    descripcion: "Aprendizaje de preparación de comidas nutritivas con ingredientes locales",
    dia: new Date('2025-10-23'),
    hora: "15:00",
    horaFin: "17:00",
    responsable: "Sofia Ramírez",
    espacioId: 2, // Barrio Las Flores
    lugar: "Cocina Comunitaria",
    esFija: true,
    isVerified: true
  },
  {
    id: 13,
    nombre: "Clase de Danza Folklórica",
    descripcion: "Enseñanza de danzas tradicionales argentinas para niños y jóvenes",
    dia: new Date('2025-10-24'),
    hora: "18:00",
    horaFin: "20:00",
    responsable: "Gabriela Morales",
    espacioId: 2, // Barrio Las Flores
    lugar: "Sala de Actividades",
    esFija: true,
    isVerified: true
  },
  {
    id: 9,
    nombre: "Jornada de Vacunación",
    descripcion: "Campaña de vacunación gratuita contra enfermedades estacionales para toda la comunidad",
    dia: new Date('2025-10-21'),
    hora: "09:00",
    horaFin: "13:00",
    responsable: "Dra. Valentina Rodríguez",
    espacioId: 6, // Hospital Central
    lugar: "Sala de Vacunas",
    esFija: false,
    isVerified: false
  },
  {
    id: 10,
    nombre: "Festival Deportivo Familiar",
    descripcion: "Evento deportivo recreativo con juegos tradicionales para familias enteras",
    dia: new Date('2025-10-26'),
    hora: "14:00",
    horaFin: "18:00",
    responsable: "Carmen Torres",
    espacioId: 4, // Complejo Los Pumitas
    lugar: "Polideportivo",
    esFija: false,
    isVerified: false
  }
];