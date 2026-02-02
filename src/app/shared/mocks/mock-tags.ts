// Mock de etiquetas generales para todas las secciones
export interface Tag {
  id: number;
  nombre: string;
  descripcion: string;
}

export const MOCK_TAGS: Tag[] = [
  // Actividades y hobbies
  { id: 1, nombre: 'Grupal', descripcion: 'Actividades realizadas en grupo' },
  { id: 2, nombre: 'Individual', descripcion: 'Actividades realizadas de forma individual' },
  { id: 3, nombre: 'Deporte', descripcion: 'Actividades deportivas y físicas' },
  { id: 4, nombre: 'Aire libre', descripcion: 'Actividades al aire libre y naturaleza' },
  { id: 5, nombre: 'Belleza', descripcion: 'Cuidado personal y estética' },
  { id: 6, nombre: 'Arte', descripcion: 'Expresión artística y creatividad' },
  { id: 7, nombre: 'Música', descripcion: 'Actividades musicales y auditivas' },
  { id: 8, nombre: 'Danza', descripcion: 'Actividades de movimiento y baile' },
  { id: 9, nombre: 'Fotografía', descripcion: 'Arte visual y captura de momentos' },
  { id: 10, nombre: 'Cocina', descripcion: 'Preparación de alimentos y gastronomía' },

  // Salud y bienestar
  { id: 11, nombre: 'Salud mental', descripcion: 'Bienestar psicológico y emocional' },
  { id: 12, nombre: 'Salud física', descripcion: 'Cuidado del cuerpo y condición física' },
  { id: 13, nombre: 'Relajación', descripcion: 'Técnicas de descanso y mindfulness' },
  { id: 14, nombre: 'Meditación', descripcion: 'Prácticas contemplativas y atención plena' },
  { id: 15, nombre: 'Yoga', descripcion: 'Prácticas físicas y mentales combinadas' },
  { id: 16, nombre: 'Apoyo emocional', descripcion: 'Contención y soporte emocional' },
  { id: 17, nombre: 'Bienestar', descripcion: 'Estado general de salud y felicidad' },
  { id: 18, nombre: 'Equilibrio', descripcion: 'Balance vida personal y profesional' },

  // Desarrollo personal
  { id: 19, nombre: 'Aprendizaje', descripcion: 'Adquisición de nuevos conocimientos' },
  { id: 20, nombre: 'Motivación', descripcion: 'Impulso y energía personal' },
  { id: 21, nombre: 'Liderazgo', descripcion: 'Desarrollo de habilidades de liderazgo' },
  { id: 22, nombre: 'Creatividad', descripcion: 'Expresión de ideas originales' },
  { id: 23, nombre: 'Independencia', descripcion: 'Autonomía y autosuficiencia' },
  { id: 24, nombre: 'Adaptabilidad', descripcion: 'Flexibilidad ante cambios' },
  { id: 25, nombre: 'Resiliencia', descripcion: 'Capacidad de recuperación' },
  { id: 26, nombre: 'Autoestima', descripcion: 'Confianza en uno mismo' },
  { id: 27, nombre: 'Empatía', descripcion: 'Comprensión emocional hacia otros' },
  { id: 28, nombre: 'Comunicación', descripcion: 'Habilidades de expresión y diálogo' },

  // Relaciones sociales
  { id: 29, nombre: 'Familia', descripcion: 'Relaciones familiares y vínculos cercanos' },
  { id: 30, nombre: 'Amigos', descripcion: 'Relaciones de amistad' },
  { id: 31, nombre: 'Comunidad', descripcion: 'Participación comunitaria' },
  { id: 32, nombre: 'Colaboración', descripcion: 'Trabajo en equipo y cooperación' },
  { id: 33, nombre: 'Solidaridad', descripcion: 'Apoyo mutuo y ayuda social' },
  { id: 34, nombre: 'Voluntariado', descripcion: 'Ayuda desinteresada a la comunidad' },
  { id: 35, nombre: 'Relaciones', descripcion: 'Vínculos interpersonales en general' },
  { id: 36, nombre: 'Compasión', descripcion: 'Cuidado y preocupación por los demás' },

  // Trabajo y formación
  { id: 37, nombre: 'Trabajo', descripcion: 'Desarrollo profesional y laboral' },
  { id: 38, nombre: 'Educación', descripcion: 'Formación académica y aprendizaje' },
  { id: 39, nombre: 'Capacitación', descripcion: 'Formación profesional específica' },
  { id: 40, nombre: 'Carrera', descripcion: 'Desarrollo profesional a largo plazo' },
  { id: 41, nombre: 'Habilidades', descripcion: 'Desarrollo de competencias técnicas' },
  { id: 42, nombre: 'Formación', descripcion: 'Educación y preparación profesional' },
  { id: 43, nombre: 'Empleo', descripcion: 'Situación laboral y trabajo remunerado' },
  { id: 44, nombre: 'Profesional', descripcion: 'Desarrollo en el ámbito laboral' },

  // Tecnología e innovación
  { id: 45, nombre: 'Tecnología', descripcion: 'Innovación tecnológica y digital' },
  { id: 46, nombre: 'Innovación', descripcion: 'Pensamiento creativo y nuevas ideas' },
  { id: 47, nombre: 'Digital', descripcion: 'Herramientas y procesos digitales' },
  { id: 48, nombre: 'Creatividad', descripcion: 'Expresión de ideas originales' },
  { id: 49, nombre: 'Avances', descripcion: 'Progreso y desarrollo tecnológico' },
  { id: 50, nombre: 'Modernidad', descripcion: 'Adaptación a tiempos actuales' },

  // Naturaleza y medio ambiente
  { id: 51, nombre: 'Naturaleza', descripcion: 'Actividades relacionadas con el medio ambiente' },
  { id: 52, nombre: 'Medio ambiente', descripcion: 'Cuidado y preservación ecológica' },
  { id: 53, nombre: 'Ecología', descripcion: 'Estudio y protección del ecosistema' },
  { id: 54, nombre: 'Sostenibilidad', descripcion: 'Desarrollo sostenible y responsable' },
  { id: 55, nombre: 'Ambiental', descripcion: 'Actividades de protección ambiental' },
  { id: 56, nombre: 'Ecológico', descripcion: 'Prácticas respetuosas con el medio ambiente' },

  // Valores y principios
  { id: 57, nombre: 'Igualdad', descripcion: 'Equidad y justicia social' },
  { id: 58, nombre: 'Justicia', descripcion: 'Derechos y justicia en la sociedad' },
  { id: 59, nombre: 'Inclusión', descripcion: 'Accesibilidad universal y diversidad' },
  { id: 60, nombre: 'Diversidad', descripcion: 'Valoración de la diferencia y pluralidad' },
  { id: 61, nombre: 'Respeto', descripcion: 'Consideración hacia los demás' },
  { id: 62, nombre: 'Tolerancia', descripcion: 'Aceptación de diferencias' },
  { id: 63, nombre: 'Ética', descripcion: 'Principios morales y valores' },
  { id: 64, nombre: 'Responsabilidad', descripcion: 'Compromiso y deberes' },

  // Economía y recursos
  { id: 65, nombre: 'Económico', descripcion: 'Aspectos financieros y económicos' },
  { id: 66, nombre: 'Financiero', descripcion: 'Gestión de recursos económicos' },
  { id: 67, nombre: 'Recursos', descripcion: 'Disponibilidad de medios y herramientas' },
  { id: 68, nombre: 'Apoyo económico', descripcion: 'Ayuda financiera y material' },
  { id: 69, nombre: 'Estabilidad', descripcion: 'Seguridad económica y personal' },
  { id: 70, nombre: 'Independencia económica', descripcion: 'Autonomía financiera' },

  // Cultura y sociedad
  { id: 71, nombre: 'Cultural', descripcion: 'Actividades culturales y artísticas' },
  { id: 72, nombre: 'Social', descripcion: 'Participación en la sociedad' },
  { id: 73, nombre: 'Viajes', descripcion: 'Exploración y conocimiento de lugares' },
  { id: 74, nombre: 'Turismo', descripcion: 'Actividades turísticas y recreativas' },
  { id: 75, nombre: 'Tradición', descripcion: 'Costumbres y herencia cultural' },
  { id: 76, nombre: 'Historia', descripcion: 'Conocimiento del pasado' },
  { id: 77, nombre: 'Sociedad', descripcion: 'Vida en comunidad' },
  { id: 78, nombre: 'Participación', descripcion: 'Involucramiento activo' },

  // Salud y prevención
  { id: 79, nombre: 'Prevención', descripcion: 'Medidas preventivas de salud' },
  { id: 80, nombre: 'Cuidado', descripcion: 'Atención y esmero personal' },
  { id: 81, nombre: 'Protección', descripcion: 'Salvaguarda y seguridad' },
  { id: 82, nombre: 'Seguridad', descripcion: 'Estado de protección y confianza' },
  { id: 83, nombre: 'Alimentación', descripcion: 'Hábitos nutricionales saludables' },
  { id: 84, nombre: 'Ejercicio', descripcion: 'Actividad física regular' },
  { id: 85, nombre: 'Descanso', descripcion: 'Reposo y recuperación' },
  { id: 86, nombre: 'Sueño', descripcion: 'Calidad del descanso nocturno' },

  // Emociones y sentimientos
  { id: 87, nombre: 'Felicidad', descripcion: 'Estado de alegría y satisfacción' },
  { id: 88, nombre: 'Alegría', descripcion: 'Emoción positiva y entusiasmo' },
  { id: 89, nombre: 'Paz', descripcion: 'Tranquilidad interior' },
  { id: 90, nombre: 'Tranquilidad', descripcion: 'Estado de calma y serenidad' },
  { id: 91, nombre: 'Esperanza', descripcion: 'Confianza en el futuro' },
  { id: 92, nombre: 'Optimismo', descripcion: 'Visión positiva de la vida' },
  { id: 93, nombre: 'Gratitud', descripcion: 'Agradecimiento y reconocimiento' },
  { id: 94, nombre: 'Amor', descripcion: 'Afecto y cariño hacia otros' },

  // Más actividades recreativas
  { id: 95, nombre: 'Entretenimiento', descripcion: 'Ocio y diversión' },
  { id: 96, nombre: 'Juegos', descripcion: 'Actividades lúdicas y recreativas' },
  { id: 97, nombre: 'Lectura', descripcion: 'Lectura de libros y textos' },
  { id: 98, nombre: 'Escritura', descripcion: 'Expresión escrita creativa' },
  { id: 99, nombre: 'Teatro', descripcion: 'Artes escénicas y representación' },
  { id: 100, nombre: 'Cine', descripcion: 'Películas y audiovisuales' }
];

// Función para obtener todas las etiquetas
export function getAllTags(): Tag[] {
  return MOCK_TAGS;
}

// Función para buscar etiquetas por nombre o descripción
export function searchTags(query: string): Tag[] {
  const lowerQuery = query.toLowerCase();
  return MOCK_TAGS.filter(tag =>
    tag.nombre.toLowerCase().includes(lowerQuery) ||
    tag.descripcion.toLowerCase().includes(lowerQuery)
  );
}

// Función para obtener etiqueta por ID
export function getTagById(id: number): Tag | undefined {
  return MOCK_TAGS.find(tag => tag.id === id);
}

// Función para obtener etiquetas por IDs
export function getTagsByIds(ids: number[]): Tag[] {
  return MOCK_TAGS.filter(tag => ids.includes(tag.id));
}