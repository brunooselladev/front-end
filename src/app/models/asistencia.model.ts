export interface Asistencia {
  id: number;
  idActividad: number;
  idUser: number; // Siempre es USMYA
  estado: 'presente' | 'ausente';
  observacion: string;
}