export interface Actividad {
  id?: number;
  nombre: string;
  descripcion: string;
  dia: Date;
  hora: string; // Formato HH:MM - Hora de inicio
  horaFin?: string; // Formato HH:MM - Hora de finalización (opcional)
  responsable: string;
  espacioId: number; // ID del espacio que la creó
  lugar: string;
  esFija: boolean; // Si la actividad es fija o no
  isVerified?: boolean; // Si la actividad está verificada
}

export interface ActividadEspacio {
  nombre: string;
  tipoActividad: 'principal' | 'secundario';
  descripcion: string;
  diasHorarios: string;
  formaConfirmacion: 'conversacion_previa' | 'whatsapp' | 'abierta' | 'otro';
}