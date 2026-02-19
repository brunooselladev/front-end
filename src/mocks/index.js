const deepClone = (value) => JSON.parse(JSON.stringify(value));

export const wait = (ms = 300) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const roleHome = {
  admin: '/admin/recursero/calendario-semanal',
  agente: '/agente/asistencia',
  efector: '/efector/pacientes',
  referente: '/referente/mis-acompanados',
  usmya: '/usmya/mi-perfil',
};

const initialState = {
  authUsers: [
    { email: 'admin1@sistema.com', password: 'Admin1234', userId: 1 },
    { email: 'admin2@sistema.com', password: 'Admin1234', userId: 2 },
    { email: 'admin3@sistema.com', password: 'Admin1234', userId: 3 },
    { email: 'admin4@sistema.com', password: 'Admin1234', userId: 4 },
    { email: 'agente1@ejemplo.com', password: 'Agente1234', userId: 5 },
    { email: 'agente2@ejemplo.com', password: 'Agente1234', userId: 6 },
    { email: 'agente3@ejemplo.com', password: 'Agente1234', userId: 7 },
    { email: 'agente4@ejemplo.com', password: 'Agente1234', userId: 8 },
    { email: 'efector1@salud.com', password: 'Efector1234', userId: 9 },
    { email: 'efector2@salud.com', password: 'Efector1234', userId: 10 },
    { email: 'efector3@salud.com', password: 'Efector1234', userId: 11 },
    { email: 'efector4@salud.com', password: 'Efector1234', userId: 12 },
    { email: 'referente1@ejemplo.com', password: 'Referente1234', userId: 13 },
    { email: 'referente2@ejemplo.com', password: 'Referente1234', userId: 14 },
    { email: 'referente3@ejemplo.com', password: 'Referente1234', userId: 15 },
    { email: 'referente4@ejemplo.com', password: 'Referente1234', userId: 16 },
    { email: 'usmya2@jovenes.com', password: 'Usmya1234', userId: 17 },
    { email: 'usmya1@jovenes.com', password: 'Usmya1234', userId: 18 },
    { email: 'usmya3@jovenes.com', password: 'Usmya1234', userId: 19 },
    { email: 'usmya4@jovenes.com', password: 'Usmya1234', userId: 20 },
    { email: 'usmya5@jovenes.com', password: 'Usmya1234', userId: 21 },
    { email: 'usmya6@jovenes.com', password: 'Usmya1234', userId: 22 },
    { email: 'usmya7@jovenes.com', password: 'Usmya1234', userId: 23 },
  ],

  users: [
    // ADMIN
    {
      id: 1, email: 'admin1@sistema.com', role: 'admin', isVerified: 'aprobado',
      nombre: 'Carlos Martinez Admin', dni: null, fechaNacimiento: null, telefono: null,
      direccionResidencia: null, alias: null, generoAutoPercibido: null, estadoCivil: null,
      obraSocial: null, geolocalizacion: null, creadoPor: null, requiereAprobacion: false,
      idEspacio: null, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: false,
    },
    {
      id: 2, email: 'admin2@sistema.com', role: 'admin', isVerified: 'aprobado',
      nombre: 'Ana Rodriguez Admin', dni: null, fechaNacimiento: null, telefono: null,
      direccionResidencia: null, alias: null, generoAutoPercibido: null, estadoCivil: null,
      obraSocial: null, geolocalizacion: null, creadoPor: null, requiereAprobacion: false,
      idEspacio: null, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: false,
    },
    {
      id: 3, email: 'admin3@sistema.com', role: 'admin', isVerified: 'aprobado',
      nombre: 'Luis Gonzalez Admin', dni: null, fechaNacimiento: null, telefono: null,
      direccionResidencia: null, alias: null, generoAutoPercibido: null, estadoCivil: null,
      obraSocial: null, geolocalizacion: null, creadoPor: null, requiereAprobacion: false,
      idEspacio: null, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: false,
    },
    {
      id: 4, email: 'admin4@sistema.com', role: 'admin', isVerified: 'aprobado',
      nombre: 'Maria Fernandez Admin', dni: null, fechaNacimiento: null, telefono: null,
      direccionResidencia: null, alias: null, generoAutoPercibido: null, estadoCivil: null,
      obraSocial: null, geolocalizacion: null, creadoPor: null, requiereAprobacion: false,
      idEspacio: null, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: false,
    },
    // AGENTE
    {
      id: 5, email: 'agente1@ejemplo.com', role: 'agente', isVerified: 'pendiente',
      nombre: 'Pedro Ramirez', dni: null, fechaNacimiento: null, telefono: '3515551001',
      direccionResidencia: null, alias: null, generoAutoPercibido: null, estadoCivil: null,
      obraSocial: null, geolocalizacion: null, creadoPor: null, requiereAprobacion: true,
      idEspacio: 1, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: false,
    },
    {
      id: 6, email: 'agente2@ejemplo.com', role: 'agente', isVerified: 'pendiente',
      nombre: 'Sofia Mendez', dni: null, fechaNacimiento: null, telefono: '3515551002',
      direccionResidencia: null, alias: null, generoAutoPercibido: null, estadoCivil: null,
      obraSocial: null, geolocalizacion: null, creadoPor: null, requiereAprobacion: true,
      idEspacio: 2, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: false,
    },
    {
      id: 7, email: 'agente3@ejemplo.com', role: 'agente', isVerified: 'pendiente',
      nombre: 'Roberto Silva', dni: null, fechaNacimiento: null, telefono: '3515551003',
      direccionResidencia: null, alias: null, generoAutoPercibido: null, estadoCivil: null,
      obraSocial: null, geolocalizacion: null, creadoPor: null, requiereAprobacion: true,
      idEspacio: 3, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: false,
    },
    {
      id: 8, email: 'agente4@ejemplo.com', role: 'agente', isVerified: 'pendiente',
      nombre: 'Carmen Torres', dni: null, fechaNacimiento: null, telefono: '3515551004',
      direccionResidencia: null, alias: null, generoAutoPercibido: null, estadoCivil: null,
      obraSocial: null, geolocalizacion: null, creadoPor: null, requiereAprobacion: true,
      idEspacio: 4, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: false,
    },
    // EFECTOR
    {
      id: 9, email: 'efector1@salud.com', role: 'efector', isVerified: 'pendiente',
      nombre: 'Dr. Juan Perez', dni: null, fechaNacimiento: null, telefono: '3515552001',
      direccionResidencia: null, alias: null, generoAutoPercibido: null, estadoCivil: null,
      obraSocial: null, geolocalizacion: null, creadoPor: null, requiereAprobacion: true,
      idEspacio: 6, tipoProfesional: 'Medico Clinico', esEfector: true, esETratante: true, registroConUsmya: false,
    },
    {
      id: 10, email: 'efector2@salud.com', role: 'efector', isVerified: 'pendiente',
      nombre: 'Dra. Laura Garcia', dni: null, fechaNacimiento: null, telefono: '3515552002',
      direccionResidencia: null, alias: null, generoAutoPercibido: null, estadoCivil: null,
      obraSocial: null, geolocalizacion: null, creadoPor: null, requiereAprobacion: true,
      idEspacio: 1, tipoProfesional: 'Psicologa', esEfector: true, esETratante: false, registroConUsmya: false,
    },
    {
      id: 11, email: 'efector3@salud.com', role: 'efector', isVerified: 'pendiente',
      nombre: 'Lic. Miguel Lopez', dni: null, fechaNacimiento: null, telefono: '3515552003',
      direccionResidencia: null, alias: null, generoAutoPercibido: null, estadoCivil: null,
      obraSocial: null, geolocalizacion: null, creadoPor: null, requiereAprobacion: true,
      idEspacio: 2, tipoProfesional: 'Trabajador Social', esEfector: true, esETratante: true, registroConUsmya: false,
    },
    {
      id: 12, email: 'efector4@salud.com', role: 'efector', isVerified: 'pendiente',
      nombre: 'Dra. Valentina Rodriguez', dni: null, fechaNacimiento: null, telefono: '3515552004',
      direccionResidencia: null, alias: null, generoAutoPercibido: null, estadoCivil: null,
      obraSocial: null, geolocalizacion: null, creadoPor: null, requiereAprobacion: true,
      idEspacio: 5, tipoProfesional: 'Psiquiatra', esEfector: true, esETratante: false, registroConUsmya: false,
    },
    // REFERENTE
    {
      id: 13, email: 'referente1@ejemplo.com', role: 'referente', isVerified: 'pendiente',
      nombre: 'Marcela Suarez', dni: null, fechaNacimiento: null, telefono: '3515553001',
      direccionResidencia: null, alias: null, generoAutoPercibido: null, estadoCivil: null,
      obraSocial: null, geolocalizacion: null, creadoPor: null, requiereAprobacion: true,
      idEspacio: null, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: true,
    },
    {
      id: 14, email: 'referente2@ejemplo.com', role: 'referente', isVerified: 'pendiente',
      nombre: 'Diego Morales', dni: null, fechaNacimiento: null, telefono: '3515553002',
      direccionResidencia: null, alias: null, generoAutoPercibido: null, estadoCivil: null,
      obraSocial: null, geolocalizacion: null, creadoPor: null, requiereAprobacion: true,
      idEspacio: null, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: false,
    },
    {
      id: 15, email: 'referente3@ejemplo.com', role: 'referente', isVerified: 'pendiente',
      nombre: 'Patricia Vega', dni: null, fechaNacimiento: null, telefono: '3515553003',
      direccionResidencia: null, alias: null, generoAutoPercibido: null, estadoCivil: null,
      obraSocial: null, geolocalizacion: null, creadoPor: null, requiereAprobacion: true,
      idEspacio: null, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: true,
    },
    {
      id: 16, email: 'referente4@ejemplo.com', role: 'referente', isVerified: 'pendiente',
      nombre: 'Fernando Castro', dni: null, fechaNacimiento: null, telefono: '3515553004',
      direccionResidencia: null, alias: null, generoAutoPercibido: null, estadoCivil: null,
      obraSocial: null, geolocalizacion: null, creadoPor: null, requiereAprobacion: true,
      idEspacio: null, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: false,
    },
    // USMYA
    {
      id: 17, email: 'usmya2@jovenes.com', role: 'usmya', isVerified: 'pendiente',
      nombre: 'Hector', dni: 46789012, fechaNacimiento: '1995-08-22T00:00:00.000Z',
      telefono: '3515554002', direccionResidencia: 'San Martin 567, Cordoba', alias: 'Hect',
      generoAutoPercibido: 'Masculino', estadoCivil: 'Soltero', obraSocial: 'APROSS',
      geolocalizacion: '-31.4135,-64.1810', creadoPor: 9, requiereAprobacion: true,
      idEspacio: null, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: false,
    },
    {
      id: 18, email: 'usmya1@jovenes.com', role: 'usmya', isVerified: 'pendiente',
      nombre: 'Agustina Herrera', dni: 45123456, fechaNacimiento: '2005-03-15T00:00:00.000Z',
      telefono: '3515554001', direccionResidencia: 'Av. Colon 1234, Cordoba', alias: 'Agus',
      generoAutoPercibido: 'Femenino', estadoCivil: 'Soltera', obraSocial: 'OSDE',
      geolocalizacion: '-31.4201,-64.1888', creadoPor: 13, requiereAprobacion: true,
      idEspacio: null, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: false,
    },
    {
      id: 19, email: 'usmya3@jovenes.com', role: 'usmya', isVerified: 'pendiente',
      nombre: 'Camila Romero', dni: 47345678, fechaNacimiento: '2006-01-10T00:00:00.000Z',
      telefono: '3515554003', direccionResidencia: 'Belgrano 890, Cordoba', alias: 'Cami',
      generoAutoPercibido: 'Femenino', estadoCivil: 'Soltera', obraSocial: 'Swiss Medical',
      geolocalizacion: '-31.4167,-64.1833', creadoPor: 10, requiereAprobacion: true,
      idEspacio: null, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: false,
    },
    {
      id: 20, email: 'usmya4@jovenes.com', role: 'usmya', isVerified: 'pendiente',
      nombre: 'Santiago Moreno', dni: 48901234, fechaNacimiento: '2003-11-05T00:00:00.000Z',
      telefono: '3515554004', direccionResidencia: 'Rivadavia 345, Cordoba', alias: 'Santi',
      generoAutoPercibido: 'Masculino', estadoCivil: 'Soltero', obraSocial: 'Medicus',
      geolocalizacion: '-31.4200,-64.1900', creadoPor: 5, requiereAprobacion: true,
      idEspacio: null, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: false,
    },
    {
      id: 21, email: 'usmya5@jovenes.com', role: 'usmya', isVerified: 'pendiente',
      nombre: 'Valentina Luna', dni: 49567890, fechaNacimiento: '2005-06-18T00:00:00.000Z',
      telefono: '3515554005', direccionResidencia: '9 de Julio 678, Cordoba', alias: 'Vale',
      generoAutoPercibido: 'Femenino', estadoCivil: 'Soltera', obraSocial: 'Galeno',
      geolocalizacion: '-31.4180,-64.1850', creadoPor: 11, requiereAprobacion: true,
      idEspacio: null, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: false,
    },
    {
      id: 22, email: 'usmya6@jovenes.com', role: 'usmya', isVerified: 'pendiente',
      nombre: 'Lucas Acosta', dni: 50234567, fechaNacimiento: '2004-12-03T00:00:00.000Z',
      telefono: '3515554006', direccionResidencia: 'Independencia 901, Cordoba', alias: 'Luqui',
      generoAutoPercibido: 'Masculino', estadoCivil: 'Soltero', obraSocial: 'OSDE',
      geolocalizacion: '-31.4150,-64.1880', creadoPor: 12, requiereAprobacion: true,
      idEspacio: null, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: false,
    },
    {
      id: 23, email: 'usmya7@jovenes.com', role: 'usmya', isVerified: 'pendiente',
      nombre: 'Isabella Castro', dni: 51890123, fechaNacimiento: '2006-04-25T00:00:00.000Z',
      telefono: '3515554007', direccionResidencia: 'Tucuman 234, Cordoba', alias: 'Isa',
      generoAutoPercibido: 'Femenino', estadoCivil: 'Soltera', obraSocial: 'APROSS',
      geolocalizacion: '-31.4170,-64.1820', creadoPor: 13, requiereAprobacion: true,
      idEspacio: null, tipoProfesional: null, esEfector: false, esETratante: false, registroConUsmya: false,
    },
  ],

  espacios: [
    {
      id: 1, nombre: 'Las Aldeas', telefono: '3525518659', tipoOrganizacion: 'comunitario',
      direccion: 'Av. Siempre Viva 123', barrio: 'Las Aldeas', encargado: 'Mauricio Ribotta',
      poblacionVinculada: ['niños', 'adolescentes', 'familias'],
      diasHorarios: 'Lunes a Viernes 9:00-17:00',
      actividadesPrincipales: 'Talleres comunitarios, apoyo escolar',
      actividadesSecundarias: 'Actividades recreativas, distribución de alimentos',
      coordenadas: { lat: -31.3987, lng: -64.1945 },
    },
    {
      id: 2, nombre: 'Copaby Merendero El Maná', telefono: '3516726929', tipoOrganizacion: 'merendero',
      direccion: 'Calle del Maná 456', barrio: 'Villa El Maná', encargado: 'Carmen Villegas',
      poblacionVinculada: ['niños', 'adolescentes'],
      diasHorarios: 'Lunes a Sábado 11:00-15:00',
      actividadesPrincipales: 'Comedor infantil, merienda escolar',
      actividadesSecundarias: 'Talleres educativos, apoyo escolar',
      coordenadas: { lat: -31.4123, lng: -64.1789 },
    },
    {
      id: 3, nombre: 'Ministerio de Restauración Taller del Maestro', telefono: '3517486326',
      tipoOrganizacion: 'religiosa', direccion: 'Bv. Los Tilos 789', barrio: 'Taller del Maestro',
      encargado: 'Juan Pablo Dávila', poblacionVinculada: ['niños', 'adolescentes', 'adultos', 'familias'],
      diasHorarios: 'Martes y Jueves 19:00-22:00',
      actividadesPrincipales: 'Actividades religiosas, talleres espirituales',
      actividadesSecundarias: 'Apoyo comunitario, consejería',
      coordenadas: { lat: -31.4298, lng: -64.1678 },
    },
    {
      id: 4, nombre: 'Centro Vecinal Villa Cornu Anexo', telefono: '3517450360',
      tipoOrganizacion: 'centro vecinal', direccion: 'Villa Cornu 321', barrio: 'Villa Cornu',
      encargado: 'Gabriela Ochoa', poblacionVinculada: ['familias', 'adultos', 'mayores'],
      diasHorarios: 'Miércoles y Viernes 18:00-21:00',
      actividadesPrincipales: 'Reuniones vecinales, gestión de trámites',
      actividadesSecundarias: 'Talleres de oficios, apoyo a adultos mayores',
      coordenadas: { lat: -31.4456, lng: -64.1890 },
    },
    {
      id: 5, nombre: 'Ministerio de Restauración Taller del Maestro', telefono: '3516761706',
      tipoOrganizacion: 'religiosa', direccion: 'Bv. Los Tilos 790', barrio: 'Taller del Maestro',
      encargado: 'Mariana Morelli', poblacionVinculada: ['niños', 'adolescentes', 'adultos', 'familias'],
      diasHorarios: 'Domingos 10:00-13:00',
      actividadesPrincipales: 'Cultos religiosos, enseñanza bíblica',
      actividadesSecundarias: 'Grupos de oración, actividades juveniles',
      coordenadas: { lat: -31.4299, lng: -64.1679 },
    },
    {
      id: 6, nombre: 'Primeras Herramientas', telefono: '3512461376',
      tipoOrganizacion: 'educacion', direccion: 'Herramientas 654', barrio: 'Primeras Herramientas',
      encargado: 'Erika Monjes', poblacionVinculada: ['niños', 'adolescentes'],
      diasHorarios: 'Lunes a Viernes 8:00-16:00',
      actividadesPrincipales: 'Educación inicial, talleres pedagógicos',
      actividadesSecundarias: 'Apoyo escolar, actividades lúdicas',
      coordenadas: { lat: -31.4212, lng: -64.1765 },
    },
    {
      id: 7, nombre: 'Copa y Comedor Un Progreso para los Niños', telefono: '3512762348',
      tipoOrganizacion: 'comedor', direccion: 'Progreso 987', barrio: 'Un Progreso',
      encargado: 'Evelin Estrada', poblacionVinculada: ['niños', 'adolescentes'],
      diasHorarios: 'Lunes a Viernes 12:00-15:00',
      actividadesPrincipales: 'Comedor escolar, copa de leche',
      actividadesSecundarias: 'Talleres educativos, actividades recreativas',
      coordenadas: { lat: -31.4389, lng: -64.1823 },
    },
    {
      id: 8, nombre: 'Comedor Comunitario Cosechando Sonrisas', telefono: '3516362111',
      tipoOrganizacion: 'comedor', direccion: 'Sonrisas 147', barrio: 'Cosechando Sonrisas',
      encargado: 'Miriam López', poblacionVinculada: ['niños', 'familias'],
      diasHorarios: 'Lunes a Sábado 11:00-14:00',
      actividadesPrincipales: 'Comedor comunitario, distribución de alimentos',
      actividadesSecundarias: 'Talleres de cocina, apoyo nutricional',
      coordenadas: { lat: -31.4156, lng: -64.1912 },
    },
    {
      id: 9, nombre: 'Piecitos Descalzos de Corazón', telefono: '3515936284',
      tipoOrganizacion: 'comunitario', direccion: 'Corazón 258', barrio: 'Piecitos Descalzos',
      encargado: 'Carina Castro', poblacionVinculada: ['niños', 'adolescentes'],
      diasHorarios: 'Martes y Jueves 16:00-19:00',
      actividadesPrincipales: 'Actividades infantiles, apoyo escolar',
      actividadesSecundarias: 'Talleres artísticos, actividades deportivas',
      coordenadas: { lat: -31.4278, lng: -64.1734 },
    },
  ],

  actividades: [
    {
      id: 1, nombre: 'Taller de Arte para Niños',
      descripcion: 'Taller creativo donde los niños aprenden técnicas básicas de pintura y dibujo con materiales reciclados',
      dia: '2025-10-29', hora: '14:00', horaFin: '16:00', responsable: 'María González',
      espacioId: 1, lugar: 'Sala de Talleres', esFija: true, isVerified: true,
    },
    {
      id: 2, nombre: 'Reunión Vecinal',
      descripcion: 'Encuentro mensual para discutir temas comunitarios y planificar actividades del barrio',
      dia: '2025-10-27', hora: '18:30', horaFin: '20:30', responsable: 'Carlos Rodríguez',
      espacioId: 2, lugar: 'Salón Principal', esFija: true, isVerified: true,
    },
    {
      id: 3, nombre: 'Merienda Saludable',
      descripcion: 'Distribución de merienda nutritiva para niños del barrio con actividades recreativas',
      dia: '2025-10-30', hora: '16:00', horaFin: '17:00', responsable: 'Ana Martínez',
      espacioId: 3, lugar: 'Patio Central', esFija: true, isVerified: true,
    },
    {
      id: 4, nombre: 'Entrenamiento de Fútbol Infantil',
      descripcion: 'Clases de fútbol para niños de 8 a 12 años con énfasis en valores y trabajo en equipo',
      dia: '2025-10-30', hora: '17:00', horaFin: '19:00', responsable: 'Pedro Sánchez',
      espacioId: 4, lugar: 'Cancha de Fútbol', esFija: true, isVerified: true,
    },
    {
      id: 5, nombre: 'Apoyo Escolar',
      descripcion: 'Clases de apoyo para estudiantes de primaria con dificultades en matemáticas y lengua',
      dia: '2025-10-31', hora: '15:30', horaFin: '17:30', responsable: 'Lic. Laura Fernández',
      espacioId: 5, lugar: 'Aula 2', esFija: true, isVerified: true,
    },
    {
      id: 6, nombre: 'Charla de Salud Mental',
      descripcion: 'Conferencia sobre importancia de la salud mental en la comunidad, con profesionales invitados',
      dia: '2025-10-31', hora: '19:00', horaFin: '21:00', responsable: 'Dr. Juan Pérez',
      espacioId: 6, lugar: 'Auditorio Principal', esFija: false, isVerified: false,
    },
    {
      id: 7, nombre: 'Taller de Huerta Comunitaria',
      descripcion: 'Aprendizaje de técnicas de cultivo urbano y mantenimiento de huertas orgánicas',
      dia: '2025-10-19', hora: '10:00', horaFin: '12:00', responsable: 'Roberto Silva',
      espacioId: 1, lugar: 'Jardín Trasero', esFija: true, isVerified: true,
    },
    {
      id: 8, nombre: 'Torneo de Ajedrez',
      descripcion: 'Competencia amistosa de ajedrez para jóvenes del barrio con premios simbólicos',
      dia: '2025-11-01', hora: '10:00', horaFin: '12:00', responsable: 'Miguel López',
      espacioId: 2, lugar: 'Sala de Reuniones', esFija: false, isVerified: false,
    },
    {
      id: 9, nombre: 'Jornada de Vacunación',
      descripcion: 'Campaña de vacunación gratuita contra enfermedades estacionales para toda la comunidad',
      dia: '2025-10-21', hora: '09:00', horaFin: '13:00', responsable: 'Dra. Valentina Rodríguez',
      espacioId: 6, lugar: 'Sala de Vacunas', esFija: false, isVerified: false,
    },
    {
      id: 10, nombre: 'Festival Deportivo Familiar',
      descripcion: 'Evento deportivo recreativo con juegos tradicionales para familias enteras',
      dia: '2025-10-26', hora: '14:00', horaFin: '18:00', responsable: 'Carmen Torres',
      espacioId: 4, lugar: 'Polideportivo', esFija: false, isVerified: false,
    },
    {
      id: 11, nombre: 'Clase de Música',
      descripcion: 'Introducción a instrumentos musicales básicos para niños de 6 a 10 años',
      dia: '2025-10-28', hora: '14:00', horaFin: '15:30', responsable: 'Carlos Música',
      espacioId: 5, lugar: 'Sala de Música', esFija: true, isVerified: true,
    },
    {
      id: 12, nombre: 'Taller de Cocina Saludable',
      descripcion: 'Aprendizaje de preparación de comidas nutritivas con ingredientes locales',
      dia: '2025-10-23', hora: '15:00', horaFin: '17:00', responsable: 'Sofia Ramírez',
      espacioId: 2, lugar: 'Cocina Comunitaria', esFija: true, isVerified: true,
    },
    {
      id: 13, nombre: 'Clase de Danza Folklórica',
      descripcion: 'Enseñanza de danzas tradicionales argentinas para niños y jóvenes',
      dia: '2025-10-24', hora: '18:00', horaFin: '20:00', responsable: 'Gabriela Morales',
      espacioId: 2, lugar: 'Sala de Actividades', esFija: true, isVerified: true,
    },
  ],

  asistencias: [
    { id: 1, idActividad: 1, idUser: 17, estado: 'presente', observacion: 'Participó activamente en todas las actividades del taller' },
    { id: 2, idActividad: 1, idUser: 18, estado: 'ausente', observacion: 'No pudo asistir por motivos familiares' },
    { id: 3, idActividad: 2, idUser: 17, estado: 'presente', observacion: 'Contribuyó con ideas para nuevas actividades comunitarias' },
    { id: 4, idActividad: 3, idUser: 19, estado: 'presente', observacion: 'Disfrutó mucho la merienda y las actividades recreativas' },
    { id: 5, idActividad: 11, idUser: 17, estado: 'ausente', observacion: 'Se sintió enferma y no pudo participar' },
    { id: 6, idActividad: 11, idUser: 20, estado: 'presente', observacion: 'Mostró gran interés por los instrumentos musicales' },
    { id: 7, idActividad: 2, idUser: 18, estado: 'presente', observacion: 'Ayudó en la organización del encuentro' },
    { id: 8, idActividad: 3, idUser: 17, estado: 'presente', observacion: 'Compartió la merienda con otros participantes' },
    { id: 9, idActividad: 2, idUser: 21, estado: 'presente', observacion: 'Propuso nuevas ideas para el barrio' },
    { id: 10, idActividad: 8, idUser: 17, estado: 'presente', observacion: 'Participó en varias rondas del torneo' },
    { id: 11, idActividad: 8, idUser: 18, estado: 'presente', observacion: 'Llegó a semifinales del torneo' },
    { id: 12, idActividad: 8, idUser: 22, estado: 'ausente', observacion: 'No pudo asistir por enfermedad' },
    { id: 13, idActividad: 12, idUser: 17, estado: 'presente', observacion: 'Aprendió a preparar ensaladas nutritivas' },
    { id: 14, idActividad: 12, idUser: 21, estado: 'presente', observacion: 'Compartió recetas familiares tradicionales' },
    { id: 15, idActividad: 12, idUser: 23, estado: 'presente', observacion: 'Disfrutó aprendiendo nuevas técnicas culinarias' },
    { id: 16, idActividad: 13, idUser: 17, estado: 'presente', observacion: 'Mostró gran entusiasmo por las danzas tradicionales' },
    { id: 17, idActividad: 13, idUser: 18, estado: 'presente', observacion: 'Aprendió los pasos básicos del chamamé' },
    { id: 18, idActividad: 13, idUser: 24, estado: 'ausente', observacion: 'Tuvo que ausentarse por compromiso familiar' },
  ],

  chats: [
    { id: 1, idUsmya: 17, tipo: 'general' },
    { id: 2, idUsmya: 18, tipo: 'general' },
    { id: 3, idUsmya: 19, tipo: 'general' },
    { id: 4, idUsmya: 17, tipo: 'tratante' },
    { id: 5, idUsmya: 18, tipo: 'tratante' },
    { id: 6, idUsmya: 19, tipo: 'tratante' },
  ],

  integrantesChat: [
    { id: 1,  idChat: 1, idUser: 6  },
    { id: 2,  idChat: 1, idUser: 9  },
    { id: 3,  idChat: 1, idUser: 13 },
    { id: 4,  idChat: 2, idUser: 9  },
    { id: 5,  idChat: 2, idUser: 10 },
    { id: 6,  idChat: 2, idUser: 14 },
    { id: 7,  idChat: 3, idUser: 8  },
    { id: 8,  idChat: 3, idUser: 9  },
    { id: 9,  idChat: 3, idUser: 13 },
    { id: 10, idChat: 4, idUser: 9  },
    { id: 11, idChat: 4, idUser: 10 },
    { id: 12, idChat: 4, idUser: 11 },
    { id: 13, idChat: 5, idUser: 9  },
    { id: 14, idChat: 6, idUser: 9  },
  ],

  mensajes: [
    { id: 1,  descripcion: 'Hola equipo, Hector vino ayer al comedor comunitario. Parecía un poco ansioso.', idEmisor: 5,  idChat: 1, fecha: '2025-11-01', hora: '09:30' },
    { id: 2,  descripcion: 'Buenos días Pedro. ¿Cómo evaluaste su estado anímico? ¿Necesita alguna derivación?', idEmisor: 9,  idChat: 1, fecha: '2025-11-01', hora: '09:35' },
    { id: 3,  descripcion: 'Estoy de acuerdo con la evaluación. Hector necesita apoyo emocional. Podemos coordinar una sesión con el psicólogo.', idEmisor: 13, idChat: 1, fecha: '2025-11-01', hora: '09:40' },
    { id: 4,  descripcion: 'Perfecto. Yo me encargo de agendar la cita. También evaluemos si necesita apoyo académico adicional.', idEmisor: 5,  idChat: 1, fecha: '2025-11-01', hora: '09:45' },
    { id: 5,  descripcion: 'Hola equipo, Agustina tuvo una consulta médica esta mañana en el centro de salud.', idEmisor: 6,  idChat: 2, fecha: '2025-11-02', hora: '14:20' },
    { id: 6,  descripcion: 'Excelente que haya ido al médico. ¿Qué diagnóstico le dieron? ¿Necesita seguimiento psicológico?', idEmisor: 10, idChat: 2, fecha: '2025-11-02', hora: '14:25' },
    { id: 7,  descripcion: 'Le recomendaron hacer más ejercicio y descansar mejor. Creo que podríamos derivarlo a terapia ocupacional.', idEmisor: 14, idChat: 2, fecha: '2025-11-02', hora: '14:30' },
    { id: 8,  descripcion: 'De acuerdo. Yo me encargo de coordinar la cita. Agustina parece motivada para mejorar.', idEmisor: 6,  idChat: 2, fecha: '2025-11-02', hora: '14:35' },
    { id: 9,  descripcion: 'Buenas tardes equipo. Camila vino hoy al taller de arte. Está muy participativa.', idEmisor: 8,  idChat: 3, fecha: '2025-11-03', hora: '16:10' },
    { id: 10, descripcion: 'Hola Carmen, ¿ha podido hacer las actividades que le recomendé la semana pasada?', idEmisor: 12, idChat: 3, fecha: '2025-11-03', hora: '16:15' },
    { id: 11, descripcion: 'Sí, ha estado muy constante. Creo que está lista para el próximo nivel del programa.', idEmisor: 16, idChat: 3, fecha: '2025-11-03', hora: '16:20' },
    { id: 12, descripcion: 'Excelente progreso. Sigamos apoyándola. Recuerda que estamos aquí para lo que necesite.', idEmisor: 8,  idChat: 3, fecha: '2025-11-03', hora: '16:25' },
    { id: 13, descripcion: 'Sí, ha estado muy constante. Creo que está lista para el próximo nivel del programa.', idEmisor: 11, idChat: 4, fecha: '2025-11-03', hora: '16:25' },
    { id: 14, descripcion: 'Buenas tardes equipo. Camila vino hoy al taller de arte. Está muy participativa.', idEmisor: 10, idChat: 4, fecha: '2025-11-03', hora: '16:25' },
    { id: 15, descripcion: 'Excelente progreso. Sigamos apoyándola. Recuerda que estamos aquí para lo que necesite.', idEmisor: 9,  idChat: 4, fecha: '2025-11-03', hora: '16:25' },
    { id: 16, descripcion: 'De acuerdo. Yo me encargo de coordinar la cita. Mateo parece motivado para mejorar.', idEmisor: 10, idChat: 4, fecha: '2025-11-03', hora: '16:25' },
  ],

  referenteUsmya: [
    { id: 1, idUsmya: 17, idReferente: 14 },
    { id: 2, idUsmya: 18, idReferente: 14 },
    { id: 3, idUsmya: 19, idReferente: 14 },
    { id: 4, idUsmya: 20, idReferente: 14 },
  ],

  efectorUsmya: [
    { id: 1, idEfector: 9, idUsmya: 17 },
    { id: 2, idEfector: 9, idUsmya: 18 },
    { id: 3, idEfector: 9, idUsmya: 19 },
    { id: 4, idEfector: 9, idUsmya: 20 },
  ],

  notasTrayectoria: [
    {
      id: 1, idActor: 9, idUsmya: 17,
      titulo: 'Primera evaluación psicológica',
      observacion: 'Paciente muestra signos de ansiedad moderada. Ha expresado preocupación por su futuro laboral y educativo. Recomiendo seguimiento semanal y técnicas de relajación.',
      fecha: '2025-10-15T00:00:00.000Z', hora: '10:30',
    },
    {
      id: 2, idActor: 13, idUsmya: 17,
      titulo: 'Apoyo emocional - Sesión de acompañamiento',
      observacion: 'La paciente ha mostrado progreso en la identificación de sus emociones. Está trabajando en establecer rutinas diarias. Mantiene buena comunicación con su referente afectivo.',
      fecha: '2025-10-18T00:00:00.000Z', hora: '14:15',
    },
    {
      id: 3, idActor: 10, idUsmya: 17,
      titulo: 'Seguimiento terapéutico',
      observacion: 'Sesión productiva. La paciente ha implementado las técnicas de mindfulness sugeridas. Reporta reducción en síntomas de ansiedad. Continuar con el plan establecido.',
      fecha: '2025-10-22T00:00:00.000Z', hora: '11:00',
    },
    {
      id: 4, idActor: 14, idUsmya: 17,
      titulo: 'Revisión de objetivos semanales',
      observacion: 'Cumplimiento satisfactorio de objetivos establecidos. Ha asistido a 3 actividades grupales esta semana. Muestra mayor confianza en interacciones sociales.',
      fecha: '2025-10-25T00:00:00.000Z', hora: '16:45',
    },
    {
      id: 5, idActor: 11, idUsmya: 17,
      titulo: 'Evaluación de progreso académico',
      observacion: 'Ha mejorado su rendimiento en matemáticas. Sigue teniendo dificultades con concentración, pero está motivada para continuar. Sugiero técnicas de estudio específicas.',
      fecha: '2025-10-28T00:00:00.000Z', hora: '09:30',
    },
    {
      id: 6, idActor: 15, idUsmya: 17,
      titulo: 'Sesión de refuerzo emocional',
      observacion: 'Paciente expresó sentimientos de frustración por situaciones familiares. Trabajamos en estrategias de comunicación asertiva. Recomiendo continuar el apoyo semanal.',
      fecha: '2025-10-30T00:00:00.000Z', hora: '13:20',
    },
  ],

  tags: [
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
    { id: 11, nombre: 'Salud mental', descripcion: 'Bienestar psicológico y emocional' },
    { id: 12, nombre: 'Salud física', descripcion: 'Cuidado del cuerpo y condición física' },
    { id: 13, nombre: 'Relajación', descripcion: 'Técnicas de descanso y mindfulness' },
    { id: 14, nombre: 'Meditación', descripcion: 'Prácticas contemplativas y atención plena' },
    { id: 15, nombre: 'Yoga', descripcion: 'Prácticas físicas y mentales combinadas' },
    { id: 16, nombre: 'Apoyo emocional', descripcion: 'Contención y soporte emocional' },
    { id: 17, nombre: 'Bienestar', descripcion: 'Estado general de salud y felicidad' },
    { id: 18, nombre: 'Equilibrio', descripcion: 'Balance vida personal y profesional' },
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
    { id: 29, nombre: 'Familia', descripcion: 'Relaciones familiares y vínculos cercanos' },
    { id: 30, nombre: 'Amigos', descripcion: 'Relaciones de amistad' },
    { id: 31, nombre: 'Comunidad', descripcion: 'Participación comunitaria' },
    { id: 32, nombre: 'Colaboración', descripcion: 'Trabajo en equipo y cooperación' },
    { id: 33, nombre: 'Solidaridad', descripcion: 'Apoyo mutuo y ayuda social' },
    { id: 34, nombre: 'Voluntariado', descripcion: 'Ayuda desinteresada a la comunidad' },
    { id: 35, nombre: 'Relaciones', descripcion: 'Vínculos interpersonales en general' },
    { id: 36, nombre: 'Compasión', descripcion: 'Cuidado y preocupación por los demás' },
    { id: 37, nombre: 'Trabajo', descripcion: 'Desarrollo profesional y laboral' },
    { id: 38, nombre: 'Educación', descripcion: 'Formación académica y aprendizaje' },
    { id: 39, nombre: 'Capacitación', descripcion: 'Formación profesional específica' },
    { id: 40, nombre: 'Carrera', descripcion: 'Desarrollo profesional a largo plazo' },
    { id: 41, nombre: 'Habilidades', descripcion: 'Desarrollo de competencias técnicas' },
    { id: 42, nombre: 'Formación', descripcion: 'Educación y preparación profesional' },
    { id: 43, nombre: 'Empleo', descripcion: 'Situación laboral y trabajo remunerado' },
    { id: 44, nombre: 'Profesional', descripcion: 'Desarrollo en el ámbito laboral' },
    { id: 45, nombre: 'Tecnología', descripcion: 'Innovación tecnológica y digital' },
    { id: 46, nombre: 'Innovación', descripcion: 'Pensamiento creativo y nuevas ideas' },
    { id: 47, nombre: 'Digital', descripcion: 'Herramientas y procesos digitales' },
    { id: 48, nombre: 'Avances', descripcion: 'Progreso y desarrollo tecnológico' },
    { id: 49, nombre: 'Modernidad', descripcion: 'Adaptación a tiempos actuales' },
    { id: 50, nombre: 'Naturaleza', descripcion: 'Actividades relacionadas con el medio ambiente' },
    { id: 51, nombre: 'Medio ambiente', descripcion: 'Cuidado y preservación ecológica' },
    { id: 52, nombre: 'Ecología', descripcion: 'Estudio y protección del ecosistema' },
    { id: 53, nombre: 'Sostenibilidad', descripcion: 'Desarrollo sostenible y responsable' },
    { id: 54, nombre: 'Ambiental', descripcion: 'Actividades de protección ambiental' },
    { id: 55, nombre: 'Ecológico', descripcion: 'Prácticas respetuosas con el medio ambiente' },
    { id: 56, nombre: 'Igualdad', descripcion: 'Equidad y justicia social' },
    { id: 57, nombre: 'Justicia', descripcion: 'Derechos y justicia en la sociedad' },
    { id: 58, nombre: 'Inclusión', descripcion: 'Accesibilidad universal y diversidad' },
    { id: 59, nombre: 'Diversidad', descripcion: 'Valoración de la diferencia y pluralidad' },
    { id: 60, nombre: 'Respeto', descripcion: 'Consideración hacia los demás' },
    { id: 61, nombre: 'Tolerancia', descripcion: 'Aceptación de diferencias' },
    { id: 62, nombre: 'Ética', descripcion: 'Principios morales y valores' },
    { id: 63, nombre: 'Responsabilidad', descripcion: 'Compromiso y deberes' },
    { id: 64, nombre: 'Económico', descripcion: 'Aspectos financieros y económicos' },
    { id: 65, nombre: 'Financiero', descripcion: 'Gestión de recursos económicos' },
    { id: 66, nombre: 'Recursos', descripcion: 'Disponibilidad de medios y herramientas' },
    { id: 67, nombre: 'Apoyo económico', descripcion: 'Ayuda financiera y material' },
    { id: 68, nombre: 'Estabilidad', descripcion: 'Seguridad económica y personal' },
    { id: 69, nombre: 'Independencia económica', descripcion: 'Autonomía financiera' },
    { id: 70, nombre: 'Cultural', descripcion: 'Actividades culturales y artísticas' },
    { id: 71, nombre: 'Social', descripcion: 'Participación en la sociedad' },
    { id: 72, nombre: 'Viajes', descripcion: 'Exploración y conocimiento de lugares' },
    { id: 73, nombre: 'Turismo', descripcion: 'Actividades turísticas y recreativas' },
    { id: 74, nombre: 'Tradición', descripcion: 'Costumbres y herencia cultural' },
    { id: 75, nombre: 'Historia', descripcion: 'Conocimiento del pasado' },
    { id: 76, nombre: 'Sociedad', descripcion: 'Vida en comunidad' },
    { id: 77, nombre: 'Participación', descripcion: 'Involucramiento activo' },
    { id: 78, nombre: 'Prevención', descripcion: 'Medidas preventivas de salud' },
    { id: 79, nombre: 'Cuidado', descripcion: 'Atención y esmero personal' },
    { id: 80, nombre: 'Protección', descripcion: 'Salvaguarda y seguridad' },
    { id: 81, nombre: 'Seguridad', descripcion: 'Estado de protección y confianza' },
    { id: 82, nombre: 'Alimentación', descripcion: 'Hábitos nutricionales saludables' },
    { id: 83, nombre: 'Ejercicio', descripcion: 'Actividad física regular' },
    { id: 84, nombre: 'Descanso', descripcion: 'Reposo y recuperación' },
    { id: 85, nombre: 'Sueño', descripcion: 'Calidad del descanso nocturno' },
    { id: 86, nombre: 'Felicidad', descripcion: 'Estado de alegría y satisfacción' },
    { id: 87, nombre: 'Alegría', descripcion: 'Emoción positiva y entusiasmo' },
    { id: 88, nombre: 'Paz', descripcion: 'Tranquilidad interior' },
    { id: 89, nombre: 'Tranquilidad', descripcion: 'Estado de calma y serenidad' },
    { id: 90, nombre: 'Esperanza', descripcion: 'Confianza en el futuro' },
    { id: 91, nombre: 'Optimismo', descripcion: 'Visión positiva de la vida' },
    { id: 92, nombre: 'Gratitud', descripcion: 'Agradecimiento y reconocimiento' },
    { id: 93, nombre: 'Amor', descripcion: 'Afecto y cariño hacia otros' },
    { id: 94, nombre: 'Entretenimiento', descripcion: 'Ocio y diversión' },
    { id: 95, nombre: 'Juegos', descripcion: 'Actividades lúdicas y recreativas' },
    { id: 96, nombre: 'Lectura', descripcion: 'Lectura de libros y textos' },
    { id: 97, nombre: 'Escritura', descripcion: 'Expresión escrita creativa' },
    { id: 98, nombre: 'Teatro', descripcion: 'Artes escénicas y representación' },
    { id: 99, nombre: 'Cine', descripcion: 'Películas y audiovisuales' },
  ],
};

let state = deepClone(initialState);

const nextId = (collection) => {
  if (!collection.length) return 1;
  return Math.max(...collection.map((item) => Number(item.id) || 0)) + 1;
};

export const mockStore = {
  reset() {
    state = deepClone(initialState);
    return deepClone(state);
  },
  getState() {
    return deepClone(state);
  },
  getHomePathByRole(role) {
    return roleHome[role] || '/login';
  },
  read(collectionName) {
    return deepClone(state[collectionName] || []);
  },
  findById(collectionName, id) {
    const collection = state[collectionName] || [];
    return deepClone(collection.find((item) => Number(item.id) === Number(id)) || null);
  },
  insert(collectionName, payload) {
    if (!state[collectionName]) state[collectionName] = [];
    const entity = { id: nextId(state[collectionName]), ...payload };
    state[collectionName].push(entity);
    return deepClone(entity);
  },
  update(collectionName, id, patch) {
    const collection = state[collectionName] || [];
    const index = collection.findIndex((item) => Number(item.id) === Number(id));
    if (index < 0) return null;
    collection[index] = { ...collection[index], ...patch };
    return deepClone(collection[index]);
  },
  remove(collectionName, id) {
    const collection = state[collectionName] || [];
    const index = collection.findIndex((item) => Number(item.id) === Number(id));
    if (index < 0) return false;
    collection.splice(index, 1);
    return true;
  },
};

export const mockMenuByRole = {
  admin: [
    {
      label: 'Recursero',
      icon: '/assets/recursero.svg',
      url: '/recursero',
      subsections: [
        { label: 'Calendario semanal', icon: '/assets/recursero.svg', url: '/admin/recursero/calendario-semanal' },
        { label: 'Prestaciones', icon: '/assets/recursero.svg', url: '/admin/recursero/prestaciones' },
      ],
    },
    {
      label: 'Notificaciones',
      icon: '/assets/notificaciones.svg',
      url: '/admin',
      subsections: [
        { label: 'Usuarios', icon: '/assets/notificaciones.svg', url: '/admin/notificaciones' },
        { label: 'Actividades', icon: '/assets/notificaciones.svg', url: '/admin/notificaciones-actividades' },
      ],
    },
    { label: 'Espacios', icon: '/assets/espacios.svg', url: '/admin/espacios' },
  ],
  agente: [
    { label: 'Asistencias', icon: '/assets/asistencias.svg', url: '/agente/asistencia' },
    { label: 'Nuevo usuario', icon: '/assets/registro-paciente.svg', url: '/agente/registro-usmya' },
    { label: 'Sala de chat', icon: '/assets/chat.svg', url: '/agente/chat-general' },
    { label: 'Perfil espacio', icon: '/assets/perfil-espacio.svg', url: '/agente/mi-institucion' },
  ],
  efector: [
    { label: 'Mis pacientes', icon: '/assets/mis-acompanados.svg', url: '/efector/pacientes' },
    {
      label: 'Sala de chat',
      icon: '/assets/chat.svg',
      url: '/efector',
      subsections: [
        { label: 'Sala general', icon: '/assets/chat.svg', url: '/efector/chat-general' },
        { label: 'Sala e.tratante', icon: '/assets/chat.svg', url: '/efector/chat-tratante' },
      ],
    },
    { label: 'Mi institucion', icon: '/assets/perfil-espacio.svg', url: '/efector/mi-institucion' },
  ],
  referente: [
    { label: 'Mis acompanados', icon: '/assets/mis-acompanados.svg', url: '/referente/mis-acompanados' },
    { label: 'Sala de chat', icon: '/assets/chat.svg', url: '/referente/chat-general' },
  ],
  usmya: [
    { label: 'Mi Trayectoria', icon: '/assets/trayectoria.svg', url: '/usmya/mi-trayectoria' },
    { label: 'Mi perfil', icon: '/assets/mi-perfil.svg', url: '/usmya/mi-perfil' },
  ],
};